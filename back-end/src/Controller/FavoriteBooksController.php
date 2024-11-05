<?php

namespace App\Controller;


use App\Entity\FavoriteBooks;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\EbookRepository;
use App\Repository\FavoriteBooksRepository;
use App\Repository\UserLibraryRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Security\User\JWTUserInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class FavoriteBooksController extends AbstractController
{

    #[Route('/favorites_add', name: 'AddTofavorites', methods: ['POST'])]
    public function AddToFavorites(
        Request $request,
        EntityManagerInterface $entityManager,
        EbookRepository $ebookRepository,
        UserRepository $userRepository,
        JWTEncoderInterface $JWTInterface
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $ebookId = $data['ebook_id'] ?? null;

        if (!$ebookId) {
            return new JsonResponse(['message' => 'Ebook ID not provided'], Response::HTTP_BAD_REQUEST);
        }

        $ebook = $ebookRepository->find($ebookId);

        if (!$ebook) {
            return new JsonResponse(['message' => 'Ebook not found'], Response::HTTP_NOT_FOUND);
        }

        $authHeaders = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $authHeaders);

        $decodedToken = $JWTInterface->decode($token);
        $userId = $decodedToken["id"];

        $user = $userRepository->find($userId);
        if (!$user) {
            return new JsonResponse(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        // Récupérer la bibliothèque de l'utilisateur
        $userLibrary = $user->getUserLibrary();

        // Vérifier si l'ebook est déjà dans la bibliothèque de l'utilisateur
        if ($userLibrary->getEbook()->contains($ebook)) {
            return new JsonResponse(['message' => 'Ebook already in library'], Response::HTTP_CONFLICT);
        }

        // Ajouter l'ebook à la bibliothèque de l'utilisateur
        $userLibrary->addEbook($ebook);


        // Persistez les modifications dans la base de données
        $entityManager->flush();

        return new JsonResponse(['message' => 'Ebook added to library'], Response::HTTP_CREATED);
    }

    #[Route('/remove_favorites', name: 'RemoveFavorites', methods: ['POST'])]
    public function RemoveFavorites(
        Request $request,
        JWTEncoderInterface $JWTInterface,
        EntityManagerInterface $entityManager,
        EbookRepository $ebookRepository,
        UserRepository $userRepository,
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $ebookId = $data['ebook_id'] ?? null;

        if (!$ebookId) {
            return new JsonResponse(['message' => 'Ebook ID not provided'], Response::HTTP_BAD_REQUEST);
        }

        $authHeaders = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $authHeaders);

        $decodedtoken = $JWTInterface->decode($token);
        $userId = $decodedtoken["id"];
        $user = $userRepository->find($userId);

        if (!$user) {
            return new JsonResponse(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $ebook = $ebookRepository->find($ebookId);

        if (!$ebook) {
            return new JsonResponse(['message' => 'Ebook not found'], Response::HTTP_NOT_FOUND);
        }

        $userLibrary = $user->getUserLibrary();

        if (!$userLibrary) {
            return new JsonResponse(['message' => 'User library not found'], Response::HTTP_NOT_FOUND);
        }

        // Supprimer l'ebook de la librairie de l'utilisateur
        $userLibrary->removeEbook($ebook);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Ebook removed from favorites'], Response::HTTP_OK);
    }


    #[Route('/favorites', name: 'Favorites', methods: ['GET'])]
    public function MyFavorites(
        JWTEncoderInterface $JWTInterface,
        Request $request,
        UserRepository $userRepository,
        UserLibraryRepository $userLibraryRepository
    ): JsonResponse {
        $authHeaders = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $authHeaders);

        $decodedtoken = $JWTInterface->decode($token);
        $userId = $decodedtoken["id"];
        $user = $userRepository->find($userId);

        if (!$user) {
            return new JsonResponse(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        // Récupérer la librairie de l'utilisateur
        $userLibrary = $user->getUserLibrary();

        if (!$userLibrary) {
            return new JsonResponse(['message' => 'User library not found'], Response::HTTP_NOT_FOUND);
        }

        // Récupérer les ebooks de la librairie
        $ebooks = $userLibrary->getEbook();

        // Initialiser le tableau d'ebooks
        $ebookArray = [];

        foreach ($ebooks as $book) {
            // Récupérer les auteurs de l'ebook
            $authors = [];
            foreach ($book->getAuthors() as $author) {
                $authors[] = $author->getFullName(); // Supposons que la méthode getFullName() récupère le nom complet de l'auteur
            }

            // Construire l'ebook avec ses détails
            $ebookDetails = [
                'id' => $book->getId(),
                'title' => $book->getTitle(),
                'price' => $book->getPrice(),
                'authors' => $authors,
                'picture' => 'https://localhost:8000/images/couvertures/' . $book->getPicture(),
            ];

            // Ajouter l'ebook au tableau d'ebooks
            $ebookArray[] = $ebookDetails;
        }

        // Renvoyer le tableau d'ebooks en réponse
        return new JsonResponse(['ebooks' => $ebookArray], Response::HTTP_OK);
    }
}
