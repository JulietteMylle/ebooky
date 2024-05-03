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
use App\Entity\UserLibraryItems;
use App\Repository\EbookRepository;



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
        if ($userLibrary) {
            $userLibraryItems = $userLibrary->getEbooks();

            $items = [];
            foreach ($userLibraryItems as $userLibraryItem) {
                $ebook = $userLibraryItem->getId();
                if ($ebook) {
                    $items[] = [
                        'id' => $userLibraryItem->getId(),
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
            if ($userLibrary->getEbooks()->contains($ebook)) {
                continue;
            }


            $userLibrary->addEbook($ebook);
            $entityManager->persist($userLibrary);
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
        if (!$userLibrary->getEbooks()->contains($ebook)) {
            return new JsonResponse(['message' => 'Ebook not found in user library'], Response::HTTP_NOT_FOUND);
        }

        // Supprimer l'ebook de la bibliothèque de l'utilisateur
        $userLibrary->removeEbook($ebook);
        $entityManager->persist($userLibrary);
        $entityManager->flush();

        return new JsonResponse(['message' => "Ebook a été supprimé de votre bibliothèque"]);
    }
}
