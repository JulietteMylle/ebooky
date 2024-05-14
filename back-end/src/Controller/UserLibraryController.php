<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use App\Repository\UserLibraryRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\EbookRepository;
use App\Entity\UserLibrary;




class UserLibraryController extends AbstractController
{

    #[Route('/userlibrary', name: 'UserLibrary', methods: 'GET')]
    public function UserLibrary(
        JWTEncoderInterface $JWTInterface,
        Request $request,
        UserRepository $userRepository,
        UserLibraryRepository $UserLibraryRepository,


    ): JsonResponse {
        $authHeaders = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $authHeaders);

        $decodedtoken = $JWTInterface->decode($token);
        $userId = $decodedtoken["id"];

        $user = $userRepository->find($userId);

        if (!$user) {
            return new JsonResponse(['message' => 'Aucun utilisateur trouvé'], Response::HTTP_NOT_FOUND);
        }
        $userLibrary = $user->getUserLibrary();
        $userLibraryItems = $userLibrary->getEbook();

        if ($userLibrary) {
            $userLibraryItems = $userLibrary->getEbook();

            $items = [];
            foreach ($userLibraryItems as $userLibraryItem) {
                $ebook = $userLibraryItem->getId();
                // $favorite = $userLibrary->isFavorite();

                if ($ebook) {
                    $items[] = [
                        'id' => $userLibraryItem->getId(),
                        // 'is_favorite' => $userLibrary->isFavorite(),
                    ];
                }
            }
            return new JsonResponse([
                'items' => $items,

            ]);
        }

        return new JsonResponse([
            'items' => [],
        ]);
    }

    #[Route('/userlibrary_add', name: 'UserLibraryAdd', methods: 'POST')]
    public function AddToUserLibrary(
        JWTEncoderInterface $JWTInterface,
        Request $request,
        UserRepository $userRepository,
        UserLibraryRepository $UserLibraryRepository,
        EntityManagerInterface $entityManager,
        EbookRepository $ebookRepository


    ): JsonResponse {


        $data = json_decode($request->getContent(), true);


        // Récupérer l'utilisateur à partir du token JWT
        $authHeaders = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $authHeaders);
        $decodedToken = $JWTInterface->decode($token);
        $userId = $decodedToken["id"];
        $user = $userRepository->find($userId);

        // Vérifier si l'utilisateur existe
        if (!$user) {
            return new JsonResponse(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $ebooksIds = $data['ebooks'] ?? [];
        foreach ($ebooksIds as $ebookId) {
            $ebook = $ebookRepository->find($ebookId);

            if (!$ebook) {
                return new JsonResponse(['message' => 'Ebook non trouvé avec l\'identifiant ' . $ebookId], Response::HTTP_NOT_FOUND);
            }

            $userLibrary = $user->getUserLibrary();
            if ($userLibrary->getEbook()->contains($ebook)) {
                continue;
            }


            $userLibrary->addEbook($ebook);
            // $userLibrary->setFavorite(false); // Modification de 'favorite' ICI
            $entityManager->flush();
        }


        return new JsonResponse(['message' => 'Ebooks ajoutés à votre bibliothèque avec succès']);
    }

    #[Route('/userlibrary_delete', name: 'UserLibraryDelete', methods: 'DELETE')]
    public function DeleteFromUserLibrary(
        JWTEncoderInterface $JWTInterface,
        Request $request,
        UserRepository $userRepository,
        UserLibraryRepository $UserLibraryRepository,
        EntityManagerInterface $entityManager,
        EbookRepository $ebookRepository

    ): JsonResponse {
        // Récupérer l'utilisateur à partir du token JWT
        $authHeaders = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $authHeaders);
        $decodedToken = $JWTInterface->decode($token);
        $userId = $decodedToken["id"];
        $user = $userRepository->find($userId);

        // Vérifier si l'utilisateur existe
        if (!$user) {
            return new JsonResponse(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        // Récupérer l'ID de l'ebook à supprimer
        $data = json_decode($request->getContent(), true);
        $ebookId = $data['ebook_id'] ?? null;

        // // Vérifier si l'ID de l'ebook est fourni
        if (!$ebookId) {
            return new JsonResponse(['message' => 'Ebook ID not provided'], Response::HTTP_BAD_REQUEST);
        }

        // Récupérer l'ebook à partir de son ID
        $ebook = $ebookRepository->find($ebookId);

        // Vérifier si l'ebook existe
        if (!$ebook) {
            return new JsonResponse(['message' => 'Ebook not found with ID ' . $ebookId], Response::HTTP_NOT_FOUND);
        }

        // Récupérer la bibliothèque de l'utilisateur
        $userLibrary = $user->getUserLibrary();

        // Vérifier si l'ebook est dans la bibliothèque de l'utilisateur
        if (!$userLibrary->getEbook()->contains($ebook)) {
            return new JsonResponse(['message' => 'Ebook not found in user library'], Response::HTTP_NOT_FOUND);
        }

        // Supprimer l'ebook de la bibliothèque de l'utilisateur
        $userLibrary->removeEbook($ebook);
        $entityManager->persist($userLibrary);
        $entityManager->flush();

        return new JsonResponse(['message' => "Ebook a été supprimé de votre bibliothèque"]);
    }

    // #[Route('/userlibrary_add_favorites', name: 'UserLibraryAddFavorites', methods: ['POST'])]
    // public function UserLibraryAddFavorites(
    //     Request $request,
    //     EbookRepository $ebookRepository,
    //     JWTEncoderInterface $JWTInterface,
    //     UserRepository $userRepository,
    //     UserLibraryRepository $userLibraryRepository,
    //     EntityManagerInterface $entityManager
    // ): JsonResponse {
    //     $data = json_decode($request->getContent(), true);
    //     $ebookId = $data['ebook_id'];  // Assurez-vous que 'ebook_id' est envoyé dans le corps de la requête

    //     // Récupérer l'utilisateur à partir du token JWT
    //     $authHeaders = $request->headers->get('Authorization');
    //     $token = str_replace('Bearer ', '', $authHeaders);
    //     $decodedToken = $JWTInterface->decode($token);
    //     $userId = $decodedToken["id"];
    //     $user = $userRepository->find($userId);

    //     // Vérifier si l'utilisateur existe
    //     if (!$user) {
    //         return new JsonResponse(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
    //     }

    //     // Récupérer la bibliothèque de l'utilisateur
    //     $userLibrary = $user->getUserLibrary();
    //     if (!$userLibrary) {
    //         return new JsonResponse(['message' => 'User library not found'], Response::HTTP_NOT_FOUND);
    //     }

    //     // Vérifier si l'ebook est dans la bibliothèque de l'utilisateur
    //     $ebook = $ebookRepository->find($ebookId);
    //     if (!$ebook || !$userLibrary->getEbook()->contains($ebook)) {
    //         return new JsonResponse(['message' => 'Ebook not found in user library'], Response::HTTP_NOT_FOUND);
    //     }

    //     // Modifier le statut favori de l'ebook
    //     $userLibrary->setFavorite(true, $ebook);
    //     $entityManager->flush();

    //     return new JsonResponse(['message' => 'Ebook favorite status updated to true']);
    // }


    // #[Route('/userlibrary_add_favorites', name: 'UserLibraryAddFavorites', methods: ['POST'])]
    // public function UserLibraryAddFavorites(
    //     Request $request,
    //     EntityManagerInterface $entityManager,
    //     EbookRepository $ebookRepository,
    //     UserRepository $userRepository,
    //     JWTEncoderInterface $JWTInterface
    // ): JsonResponse {
    //     // Extraire les données du corps de la requête
    //     $data = json_decode($request->getContent(), true);

    //     // Vérifier si l'ID de l'ebook est défini dans les données
    //     // if (!isset($data['id'])) {
    //     //     return new JsonResponse(['error' => 'ID de ebook non trouve'], Response::HTTP_BAD_REQUEST);
    //     // }
    //     $ebookId = $data['ebook_id'];
    //     // $ebookId = $request->request->get('ebook_id'); // jnunujbbib

    //     // $isFavorite = $data["is_favorite"];

    //     $authHeaders = $request->headers->get('Authorization');
    //     $token = str_replace('Bearer ', '', $authHeaders);
    //     $decodedToken = $JWTInterface->decode($token);
    //     $userId = $decodedToken["id"];
    //     $user = $userRepository->find($userId);

    //     if (!$user) {
    //         return new JsonResponse(['error' => 'Utilisateur non trouvé'], Response::HTTP_NOT_FOUND);
    //     }

    //     $userLibrary = $user->getUserLibrary();

    //     $ebook = $ebookRepository->find($ebookId);

    //     if (!$ebook) {
    //         return new JsonResponse(['error' => 'Ebook non trouvé'], Response::HTTP_NOT_FOUND);
    //     }

    //     if ($isFavorite) {
    //         $userLibrary->addEbook($ebook);
    //     } else {
    //         $userLibrary->removeEbook($ebook);
    //     }

    //     $entityManager->flush();

    //     return new JsonResponse(['success' => true]);
    // }
    // #[Route('/userlibrary_add_favorites', name: 'UserLibraryAddFavorites', methods: 'POST')]
    // public function UserLibraryAddFavorites(
    //     JWTEncoderInterface $JWTInterface,
    //     Request $request,
    //     UserRepository $userRepository,
    //     UserLibraryRepository $userLibraryRepository,
    //     EntityManagerInterface $entityManager,

    // ): JsonResponse {
    //     $data = json_decode($request->getContent(), true);

    //     $authHeaders = $request->headers->get('Authorization');
    //     $token = str_replace('Bearer ', '', $authHeaders);

    //     $decodedToken = $JWTInterface->decode($token);
    //     $userId = $decodedToken["id"];

    //     $user = $userRepository->find($userId);
    //     if (!$user) {
    //         return new JsonResponse(['error' => 'Utilisateur non trouvé'], Response::HTTP_NOT_FOUND);
    //     }

    //     $ebookId = $request->request->get('ebook_id');


    //     $newStatus = $request->request->get('is_favorite', false);

    //     $userLibrary = $user->getUserLibrary();
    //     if (!$userLibrary) {
    //         return new JsonResponse(['error' => 'Pas de userlibrary trouvé'], Response::HTTP_NOT_FOUND);
    //     }

    //     $userLibraryItem = $userLibrary->getEbook($ebookId);
    //     if (!$userLibraryItem) {
    //         return new JsonResponse(['error' => 'Ebook non trouvé'], Response::HTTP_NOT_FOUND);
    //     }

    //     // Mettre à jour le statut de favori
    //     $userLibrary->setFavorite(true, $newStatus);
    //     $entityManager->flush();

    //     return new JsonResponse(['success' => 'Statut de favori mis à jour']);
    // }



    // #[Route('/userlibrary_favorites', name: 'UserLibraryFavorites', methods: 'GET')]
    // public function UserLibraryFavorites(
    //     JWTEncoderInterface $JWTInterface,
    //     Request $request,
    //     UserRepository $userRepository,
    //     UserLibraryRepository $userLibraryRepository
    // ): JsonResponse {
    //     $authHeaders = $request->headers->get('Authorization');
    //     $token = str_replace('Bearer ', '', $authHeaders);

    //     $decodedToken = $JWTInterface->decode($token);
    //     $userId = $decodedToken["id"];

    //     $user = $userRepository->find($userId);

    //     if (!$user) {
    //         return new JsonResponse(['error' => 'Utilisateur non trouvé'], Response::HTTP_NOT_FOUND);
    //     }

    //     $userLibrary = $user->getUserLibrary();

    //     if (!$userLibrary) {
    //         return new JsonResponse(['error' => 'Pas de userlibrary trouvé'], Response::HTTP_NOT_FOUND);
    //     }

    //     $userLibraryItems = $userLibrary->getEbook();
    //     $favorites = [];

    //     foreach ($userLibraryItems as $userLibraryItem) {
    //         // Utilisez la méthode isFavorite de UserLibrary pour vérifier si l'ebook est un favori
    //         $favorites[] = [
    //             'id' => $userLibraryItem->getId(),
    //             'is_favorite' => $userLibrary->isFavorite($userLibraryItem),
    //         ];
    //     }

    //     return new JsonResponse(['favorites' => $favorites]);
    // }


    // #[Route('/userlibrary_remove_favorite', name: 'UserLibraryRemoveFavorite', methods: 'PATCH')]
    // public function UserLibraryRemoveFromFavorites(
    //     Request $request,
    //     JWTEncoderInterface $JWTInterface,
    //     UserRepository $userRepository,
    //     EntityManagerInterface $entityManager,
    //     EbookRepository $ebookRepository
    // ): JsonResponse {


    //     $authHeaders = $request->headers->get('Authorization');
    //     $token = str_replace('Bearer ', '', $authHeaders);
    //     $decodedToken = $JWTInterface->decode($token);
    //     $userId = $decodedToken["id"];
    //     $user = $userRepository->find($userId);

    //     // Vérifier si l'utilisateur existe
    //     if (!$user) {
    //         return new JsonResponse(['error' => 'Utilisateur non trouvé'], Response::HTTP_NOT_FOUND);
    //     }
    //     // Extraire l'ID du livre à supprimer des favoris de la requête
    //     $data = json_decode($request->getContent(), true);
    //     $ebookId = $data['ebook_id'] ?? null;

    //     if (!$ebookId) {
    //         return new JsonResponse(['message' => 'Ebook ID not provided'], Response::HTTP_BAD_REQUEST);
    //     }

    //     // Récupérer l'ebook à partir de son ID
    //     $ebook = $ebookRepository->find($ebookId);

    //     // Vérifier si l'ebook existe
    //     if (!$ebook) {
    //         return new JsonResponse(['error' => 'Livre non trouvé avec l\'identifiant ' . $ebookId], Response::HTTP_NOT_FOUND);
    //     }

    //     // Récupérer la bibliothèque de l'utilisateur
    //     $userLibrary = $user->getUserLibrary();

    //     // Vérifier si l'ebook est dans les favoris de l'utilisateur
    //     if (!$userLibrary->isFavorite($ebook)) {
    //         return new JsonResponse(['error' => 'Livre non trouvé dans les favoris de l\'utilisateur'], Response::HTTP_NOT_FOUND);
    //     }

    //     // Supprimer l'ebook des favoris de l'utilisateur
    //     // $userLibrary->removeEbook($ebook);
    //     $userLibrary->setFavorite(false);
    //     $entityManager->persist($userLibrary);

    //     $entityManager->flush();

    //     return new JsonResponse(['message' => "Livre retiré des favoris avec succès"]);
    // }
}
