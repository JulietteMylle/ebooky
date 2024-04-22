<?php

namespace App\Controller;

use App\Repository\AuthorRepository;
use App\Repository\CartRepository;
use App\Repository\EbookRepository;
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
            $publishers = [];
            foreach ($ebook->getPublisher() as $publisher) {
                $publishers[] = $publisher->getName();
            }
            $ebookData[] = [
                'id' => $ebook->getId(),
                'title' => $ebook->getTitle(),
                'picture' => 'https://localhost:8000/images/couvertures/' . $ebook->getPicture(),
                'description' => $ebook->getDescription(),
                'authors' => $authors,
                'price' => $ebook->getPrice(),
                'status' => $ebook->getStatus(),
                'publisher' => $publishers,

            ];
        }

        return new JsonResponse($ebookData);
    }

    #[Route('/admin/editEbook/{id}', name: 'adminEditEbook', methods: "PUT")]
    public function adminEditEbook(int $id, AuthorRepository $authorRepository, EbookRepository $ebookRepository, UserRepository $userRepository, JWTEncoderInterface $JWTInterface, Request $request, EntityManagerInterface $entityManager): JsonResponse
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
        dd($data);

        // Récupérer l'ebook à mettre à jour
        $ebook = $ebookRepository->find($id);
        if (!$ebook) {
            return new JsonResponse(['error' => 'Ebook non trouvé'], Response::HTTP_NOT_FOUND);
        }


        // Mettre à jour les données de l'ebook
        $ebook->setTitle($data['title']);
        $ebook->setDescription($data['description']);
        $ebook->setPrice($data['price']);
        $ebook->setStatus($data['status']);
        $ebook->addAuthor($data['author']);

        // Enregistrer les modifications
        $entityManager->persist($ebook);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Ebook mis à jour avec succès']);
    }
}
