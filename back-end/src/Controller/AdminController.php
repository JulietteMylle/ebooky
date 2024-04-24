<?php

namespace App\Controller;

use App\Entity\Author;
use App\Entity\Publisher;
use App\Repository\AuthorRepository;
use App\Repository\CartRepository;
use App\Repository\EbookRepository;
use App\Repository\PublisherRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

class AdminController extends AbstractController
{
    #[Route('/admin/profile', name: 'adminProfile', methods: 'GET')]
    public function adminProfile(
        Security $security,
        EntityManagerInterface $entityManager,
        Request $request,
        JWTEncoderInterface $JWTInterface,
        UserRepository $userRepository
    ): JsonResponse {
        $authHeaders = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $authHeaders);
        $decodedtoken = $JWTInterface->decode($token);
        $email = $decodedtoken["email"];
        $user = $userRepository->findOneBy(["email" => $email]);
        $username = $user->getUsername();

        $responseData = [
            'email' => $email,
            'username' => $username,

        ];
        return new JsonResponse($responseData);
    }

    #[Route('/admin/updateProfile', name: 'adminUpdateProfile', methods: "PUT")]
    public function adminUpdateProfile(
        JWTEncoderInterface $JWTInterface,
        Request $request,
        EntityManagerInterface $entityManager,
        UserRepository $userRepository
    ): JsonResponse {
        $authHeaders = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $authHeaders);

        $decodedtoken = $JWTInterface->decode($token);
        $email = $decodedtoken["email"];
        $user = $userRepository->findOneBy(["email" => $email]);

        $requestData = json_decode($request->getContent(), true);

        if (isset($requestData['username'])) {
            $user->setUsername($requestData['username']);
        }
        if (isset($requestData['email'])) {
            $user->setEmail($requestData['email']);
        }

        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Profil mis à jour avec succès']);
    }

    #[Route('/admin/deleteProfile', name: 'deleteProfile', methods: "DELETE")]
    public function adminDeleteProfile(
        JWTEncoderInterface $JWTInterface,
        Request $request,
        EntityManagerInterface $entityManager,
        UserRepository $userRepository,
        CartRepository $cartRepository,
    ): JsonResponse {
        $authHeaders = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $authHeaders);

        $decodedtoken = $JWTInterface->decode($token);
        $email = $decodedtoken["email"];
        $user = $userRepository->findOneBy(["email" => $email]);
        if (!$user) {
            return new JsonResponse(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $userId = $user->getId();
        $cart = $cartRepository->findOneBy(['userId' => $userId]);

        // Si un panier est trouvé, supprimez-le
        if ($cart) {
            $entityManager->remove($cart);
        }


        // Supprimer l'utilisateur de la base de données
        $entityManager->remove($user);

        $entityManager->flush();

        return new JsonResponse(['message' => 'User deleted successfully'], Response::HTTP_OK);
    }
    #[Route('/admin/ebookListPage', name: 'adminEbookListPage', methods: "GET")]
    public function adminEbookListPage(EbookRepository $ebookRepository, UserRepository $userRepository, JWTEncoderInterface $JWTInterface, Request $request): JsonResponse
    {
        $authHeaders = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $authHeaders);
        $decodedtoken = $JWTInterface->decode($token);
        $email = $decodedtoken["email"];
        $user = $userRepository->findOneBy(["email" => $email]);
        $roles = $user->getRoles();
        if (!$user || !in_array('ROLE_ADMIN', $roles)) {
            return new JsonResponse("Vous n'avez pas accès à cette page");
        }

        $ebooks = $ebookRepository->findAll();
        $ebookData = [];

        foreach ($ebooks as $ebook) {
            $authors = [];
            foreach ($ebook->getAuthors() as $author) {
                $authors[] = $author->getFullName();
            }



            $ebookData[] = [
                'id' => $ebook->getId(),
                'title' => $ebook->getTitle(),
                'picture' => 'https://localhost:8000/images/couvertures/' . $ebook->getPicture(),
                'description' => $ebook->getDescription(),
                'authors' => $authors,
                'price' => $ebook->getPrice(),
                'status' => $ebook->getStatus(),

            ];
            $publisher = $ebook->getPublisher();
            if ($publisher) {
                // Ajouter le nom de l'éditeur à l'élément de $ebookData actuel
                $ebookData[count($ebookData) - 1]['publisher'] = $publisher->getName();
            }
        }

        return new JsonResponse($ebookData);
    }
    #[Route('/admin/editEbook/{id}', name: 'adminEditEbook', methods: "PUT")]
    public function adminEditEbook(AuthorRepository $authorRepository, UserRepository $userRepository, int $id, EbookRepository $ebookRepository, JWTEncoderInterface $JWTInterface, Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $authHeaders = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $authHeaders);
        $decodedtoken = $JWTInterface->decode($token);
        $email = $decodedtoken["email"];
        $user = $userRepository->findOneBy(["email" => $email]);
        $roles = $user->getRoles();

        if (!$user || !in_array('ROLE_ADMIN', $roles)) {
            return new JsonResponse("Vous n'avez pas accès à cette page");
        }

        $data = json_decode($request->getContent(), true);



        $ebook = $ebookRepository->find($id);


        if (!$ebook) {
            return new JsonResponse(['error' => 'Ebook not found'], 404);
        }
        $authorName = $data['authors'] ?? null;

        // Recherchez l'auteur en fonction de son nom
        $author = $authorRepository->findOneBy(['fullName' => $authorName]);

        // Vérifiez si l'auteur existe
        if (!$author) {
            return new JsonResponse(['error' => 'Auteur non trouvé'], 404);
        }

        // Utilisez l'identifiant de l'auteur pour la mise à jour de l'ebook
        $ebook->addAuthor($author);


        // Mise à jour des autres champs si nécessaire
        $ebook->setTitle($data['title'] ?? $ebook->getTitle());
        $ebook->setDescription($data['description'] ?? $ebook->getDescription());
        $ebook->setNumberPages($data['numberPages'] ?? $ebook->getNumberPages());
        $ebook->setPrice($data['price'] ?? $ebook->getPrice());
        $ebook->setStatus($data['status'] ?? $ebook->getStatus());

        // Retrait des anciens auteurs
        $oldAuthors = $ebook->getAuthors();
        foreach ($oldAuthors as $oldAuthor) {
            if ($oldAuthor->getId() !== $author->getId()) {
                $ebook->removeAuthor($oldAuthor);
            }
        }

        // Persistance des changements dans la base de données
        $entityManager->persist($ebook);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Ebook author updated successfully']);
    }
    #[Route('/admin/authors', name: 'admin_authors', methods: ['GET'])]
    public function admin_authors(AuthorRepository $authorRepository): JsonResponse
    {
        $authors = $authorRepository->findAll();

        $authorsData = [];
        foreach ($authors as $author) {
            $authorsData[] = [
                'id' => $author->getId(),
                'fullName' => $author->getFullName(),
                'biography' => $author->getBiography(),
                // Ajoutez d'autres données de l'auteur si nécessaire
            ];
        }

        return new JsonResponse($authorsData);
    }


    #[Route('/admin/getAuthorId', name: 'get_author_id', methods: ['GET'])]
    public function getAuthorId(Request $request, AuthorRepository $authorRepository): JsonResponse
    {
        $fullName = $request->query->get('fullName');

        // Recherche de l'auteur par son nom complet
        $author = $authorRepository->findOneBy(['fullName' => $fullName]);

        if (!$author) {
            return new JsonResponse(['error' => 'Auteur non trouvé'], 404);
        }

        return new JsonResponse(['id' => $author->getId()]);
    }
    // #[Route('/admin/createEbook', name: 'adminCreateEbook', methods: "POST")]
    // public function adminCreateEbook(Request $request, EbookRepository $ebookRepository, EntityManagerInterface $entityManager): JsonResponse
    // {

    //     $data = json_decode($request->getContent(), true);
    //     $publisher = $data['publisher'];
    //     $title = $data['title'];
    //     $description = $data['description'];
    //     $picture = $data['picture'];
    //     $publicationDate = $data[publication_date];

    //     // Créer une nouvelle instance de l'entité Ebook avec les données fournies
    //     $ebook = new Ebook();

    //     // Persister l'ebook dans la base de données
    //     $entityManager->persist($ebook);
    //     $entityManager->flush();

    //     return new JsonResponse(['message' => 'Ebook créé avec succès', 'id' => $ebook->getId()]);
    // }

    #[Route('/admin/addAuthor', name: 'admin_add_author', methods: ['POST'])]
    public function admin_add_author(Request $request, EntityManagerInterface $entityManager, AuthorRepository $authorRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $fullName = $data['fullName'];
        $biography = $data['biography'];

        if (!$fullName || !$biography) {
            return new JsonResponse(['message' => 'Tous les champs sont obligatoires']);
        }

        $author = new Author();
        $author->setFullName($fullName);
        $author->setBiography($biography);

        $entityManager->persist($author);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Le nouvel auteur a été créé'], JsonResponse::HTTP_CREATED);
    }
    #[Route('/admin/editAuthor/{id}', name: 'admin_update_author', methods: ['PUT'])]
    public function admin_update_author(Request $request, EntityManagerInterface $entityManager, AuthorRepository $authorRepository, int $id): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $fullName = $data['fullName'] ?? null;
        $biography = $data['biography'] ?? null;

        if (!$fullName || !$biography) {
            return new JsonResponse(['message' => 'Tous les champs sont obligatoires'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $author = $authorRepository->find($id);

        if (!$author) {
            return new JsonResponse(['message' => 'Auteur non trouvé'], JsonResponse::HTTP_NOT_FOUND);
        }

        $author->setFullName($fullName);
        $author->setBiography($biography);

        $entityManager->flush();

        return new JsonResponse(['message' => 'L\'auteur a été mis à jour'], JsonResponse::HTTP_OK);
    }
    #[Route('/admin/deleteAuthors/{id}', name: 'admin_delete_author', methods: ['DELETE'])]
    public function admin_delete_author(EntityManagerInterface $entityManager, AuthorRepository $authorRepository, int $id): JsonResponse
    {
        $author = $authorRepository->find($id);

        if (!$author) {
            return new JsonResponse(['message' => 'Auteur non trouvé'], JsonResponse::HTTP_NOT_FOUND);
        }

        $entityManager->remove($author);
        $entityManager->flush();

        return new JsonResponse(['message' => 'L\'auteur a été supprimé'], JsonResponse::HTTP_OK);
    }
    #[Route('/admin/publishers', name: 'admin_publishers', methods: ['GET'])]
    public function admin_publishers(PublisherRepository $publisherRepository): JsonResponse
    {
        $publishers = $publisherRepository->findAll();

        $publishersData = [];
        foreach ($publishers as $publisher) {
            $publishersData[] = [
                'id' => $publisher->getId(),
                'name' => $publisher->getName(),
                'details' => $publisher->getDetails(),
            ];
        }

        return new JsonResponse($publishersData);
    }
}
