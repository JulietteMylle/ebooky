<?php

namespace App\Controller;

use App\Entity\Author;
use App\Entity\Ebook;
use App\Entity\Publisher;
use App\Repository\AuthorRepository;
use App\Repository\CartRepository;
use App\Repository\CategoryRepository;
use App\Repository\EbookRepository;
use App\Repository\PublisherRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
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

    #[Route('/admin/addPublisher', name: 'admin_add_publisher', methods: ['POST'])]
    public function admin_add_publisher(Request $request, EntityManagerInterface $entityManager, PublisherRepository $publisherRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $name = $data['name'];
        $details = $data['details'];

        if (!$name || !$details) {
            return new JsonResponse(['message' => 'Tous les champs sont obligatoires']);
        }

        $publisher = new Publisher();
        $publisher->setName($name);
        $publisher->setDetails($details);

        $entityManager->persist($publisher);
        $entityManager->flush();

        return new JsonResponse(["message" => "La nouvelle maison d'édition a été créé"], JsonResponse::HTTP_CREATED);
    }
    #[Route('/admin/editPublisher/{id}', name: 'admin_update_publisher', methods: ['PUT'])]
    public function admin_update_publisher(Request $request, EntityManagerInterface $entityManager, PublisherRepository $publisherRepository, int $id): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $name = $data['name'] ?? null;
        $details = $data['details'] ?? null;

        if (!$name || !$details) {
            return new JsonResponse(['message' => 'Tous les champs sont obligatoires'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $publisher = $publisherRepository->find($id);

        if (!$publisher) {
            return new JsonResponse(['message' => 'Maison édition non trouvée'], JsonResponse::HTTP_NOT_FOUND);
        }

        $publisher->setName($name);
        $publisher->setDetails($details);

        $entityManager->persist($publisher);

        $entityManager->flush();

        return new JsonResponse(['message' => 'La maison édition a été mise à jour'], JsonResponse::HTTP_OK);
    }
    #[Route('/admin/deletePublisher/{id}', name: 'admin_delete_publisher', methods: ['DELETE'])]
    public function admin_delete_publisher(EntityManagerInterface $entityManager, PublisherRepository $publisherRepository, int $id): JsonResponse
    {
        $publisher = $publisherRepository->find($id);

        if (!$publisher) {
            return new JsonResponse(['message' => 'Maison édition non trouvée'], JsonResponse::HTTP_NOT_FOUND);
        }

        $entityManager->remove($publisher);
        $entityManager->flush();

        return new JsonResponse(['message' => 'La maison édition a été supprimée'], JsonResponse::HTTP_OK);
    }

    #[Route('/admin/addEbook', name: 'admin_add_ebook', methods: ['POST'])]
    public function admin_add_ebook(
        CategoryRepository $categoryRepository,
        EntityManagerInterface $entityManager,
        Request $request,
        AuthorRepository $authorRepository,
        PublisherRepository $publisherRepository,
        EbookRepository $ebookRepository
    ): JsonResponse {
        // Récupérer les données du formulaire
        $title = $request->request->get('title');
        $publisherName = $request->request->get('publisher');
        $publicationDate = new \DateTime($request->request->get('publicationDate'));
        $description = $request->request->get('description');
        $numberPages = $request->request->get('numberPages');
        $price = $request->request->get('price');
        $status = $request->request->get('status');
        $authorName = $request->request->get('author');
        $category = $request->request->get('category');

        // Recherche de l'auteur
        $author = $authorRepository->findOneBy(['fullName' => $authorName]);
        if (!$author) {
            return new JsonResponse(['error' => 'Auteur non trouvé'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Recherche de l'éditeur
        $publisher = $publisherRepository->findOneBy(['name' => $publisherName]);
        if (!$publisher) {
            // Traiter le cas où l'éditeur n'est pas trouvé
            return new JsonResponse(['error' => 'Éditeur non trouvé'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Recherche de la catégorie
        $category = $categoryRepository->findOneBy(['name' => $category]);
        if (!$category) {
            // Traiter le cas où la catégorie n'est pas trouvée
            return new JsonResponse(['error' => 'Catégorie non trouvée'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Récupérer le fichier de l'image de couverture
        $coverImageFile = $request->files->get('picture');
        if (!$coverImageFile) {
            return new JsonResponse(['error' => 'Aucune image de couverture téléchargée'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Définir le chemin complet où vous souhaitez enregistrer l'image
        $coversDirectory = $this->getParameter('kernel.project_dir') . '/public/images/couvertures';

        // Générer un nom de fichier unique pour l'image de couverture
        $newFilename = uniqid() . '.' . $coverImageFile->guessExtension();

        // Déplacer l'image vers le dossier de destination
        try {
            $coverImageFile->move($coversDirectory, $newFilename);
        } catch (FileException $e) {
            return new JsonResponse(['error' => 'Une erreur s\'est produite lors du téléchargement de l\'image'], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

        // Création de l'entité Ebook
        $ebook = new Ebook();
        $ebook->setTitle($title);
        $ebook->setPublisher($publisher);
        $ebook->setPicture($newFilename);
        $ebook->setPublicationDate($publicationDate);
        $ebook->setDescription($description);
        $ebook->setNumberPages($numberPages);
        $ebook->setPrice($price);
        $ebook->setStatus($status);
        $ebook->addAuthor($author);
        $ebook->addCategory($category);

        // Persist and flush
        $entityManager->persist($ebook);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Le Ebook a bien été créé'], JsonResponse::HTTP_CREATED);
    }

    #[Route('/admin/deleteEbook/{id}', name: 'admin_delete_ebook', methods: ['DELETE'])]
    public function admin_delete_ebook(
        EntityManagerInterface $entityManager,
        EbookRepository $ebookRepository,
        int $id,
        AuthorRepository $authorRepository,
    ): JsonResponse {
        $ebook = $ebookRepository->findOneBy(['id' => $id]);


        if (!$ebook) {
            return new JsonResponse(['message' => 'Ebook non trouvé'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Retirer les relations avec les auteurs


        // Supprimer l'ebook
        $entityManager->remove($ebook);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Le ebook a été supprimé'], JsonResponse::HTTP_OK);
    }
}
