<?php

namespace App\Controller;


use App\Entity\FavoriteBooks;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\EbookRepository;
use App\Repository\FavoriteBooksRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class FavoriteBooksController extends AbstractController
{
    // #[Route('/favorites_add', name: 'AddTofavorites', methods: ['POST'])]
    // public function AddToFavorites(
    //     int $ebookId,
    //     EntityManagerInterface $entityManager,
    //     EbookRepository $ebookRepository,
    //     UserRepository $userRepository
    // ): JsonResponse {
    //     $ebook = $ebookRepository->find($ebookId);
    //     $user = $userRepository->find($ebookId);

    //     if (!$ebook) {
    //         return new JsonResponse(['message' => 'Ebook not found']);
    //     }

    //     $favorite = new FavoriteBooks();
    //     $favorite->addUser($user);
    //     $favorite->addEbook($ebook);
    //     $favorite->setFavorite(true);
    //     $entityManager->persist($favorite);
    //     $entityManager->flush();

    //     return new JsonResponse(['message' => 'Ebook added to favorites']);
    // }
    #[Route('/favorites_add', name: 'AddTofavorites', methods: ['POST'])]
    public function AddToFavorites(
        Request $request,
        EntityManagerInterface $entityManager,
        EbookRepository $ebookRepository,
        UserRepository $userRepository,
        FavoriteBooksRepository $favoriteBooksRepository
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

        $user = $this->getUser(); // Assurez-vous que cette méthode récupère bien l'utilisateur connecté
        if (!$user) {
            return new JsonResponse(['message' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }

        // Vérification si l'ebook est déjà favori
        $favorite = $favoriteBooksRepository->findOneBy(['user' => $user, 'ebook' => $ebook]);
        if ($favorite) {
            return new JsonResponse(['message' => 'Ebook already in favorites'], Response::HTTP_CONFLICT);
        }

        // Création de la relation FavoriteBooks
        $newFavorite = new FavoriteBooks();
        $newFavorite->addUser($user);
        $newFavorite->addEbook($ebook);
        $newFavorite->setFavorite(true);
        $entityManager->persist($newFavorite);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Ebook added to favorites']);
    }


    #[Route('/remove_favorites', name: 'RemoveFavorites', methods: ['POST'])]
    public function RemoveFavorites(int $ebookId, EntityManagerInterface $entityManager, EbookRepository $ebookRepository, UserRepository $userRepository, FavoriteBooksRepository $favoriteBooksRepository): JsonResponse
    {
        $ebook = $ebookRepository->find($ebookId);
        $user = $userRepository->find(/* ID de l'utilisateur */);
        $favorite = $favoriteBooksRepository->findFavorite($user, $ebook);

        if (!$favorite) {
            return new JsonResponse(['message' => 'Favorite not found']);
        }

        $entityManager->remove($favorite);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Ebook removed from favorites']);
    }

    #[Route('/favorites', name: 'Favorites', methods: ['GET'])]
    public function MyFavorites(
        JWTEncoderInterface $JWTInterface,
        Request $request,
        UserRepository $userRepository,
        FavoriteBooksRepository $favoriteBooksRepository


    ): JsonResponse {
        $authHeaders = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $authHeaders);

        $decodedtoken = $JWTInterface->decode($token);
        $userId = $decodedtoken["id"];
        $user = $userRepository->find($userId);
        $favorites = $favoriteBooksRepository->findByUser($user);

        $favoriteData = array_map(function ($favorite) {
            return [
                'ebookId' => $favorite->getEbook()->getId(),
                'title' => $favorite->getEbook()->getTitle(),
                'isFavorite' => $favorite->isFavorite(),
            ];
        }, $favorites);

        return new JsonResponse(['favorites' => $favoriteData]);
    }
}
