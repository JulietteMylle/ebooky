<?php

namespace App\Controller;

use App\Repository\CartRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;



class ProfileController extends AbstractController
{

    #[Route('/profile', name: 'profile', methods: "GET")]
    public function profile(Security $security, EntityManagerInterface $em,  Request $request, JWTEncoderInterface $JWTInterface, UserRepository $userRepository): JsonResponse
    {
        $authHeaders = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $authHeaders);

        $decodedtoken = $JWTInterface->decode($token);
        $email = $decodedtoken["email"];
        $user = $userRepository->findOneBy(["email" => $email]);
        $username = $user->getUsername();

        $responseData = [
            'email' => $email,
            'username' => $username
        ];

        return new JsonResponse($responseData);
    }

    #[Route('/updateProfile', name: 'updateProfile', methods: "PUT")]
    public function updateProfile(
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
        // Récupérer les données envoyées par le front-end
        $requestData = json_decode($request->getContent(), true);


        // Mettre à jour les informations du profil avec les nouvelles données
        if (isset($requestData['username'])) {
            $user->setUsername($requestData['username']);
        }
        if (isset($requestData['email'])) {
            $user->setEmail($requestData['email']);
        }


        // Enregistrer les modifications dans la base de données
        $entityManager->persist($user);
        $entityManager->flush();

        // Retourner une réponse JSON avec un message de succès
        return new JsonResponse(['message' => 'Profile updated successfully']);
    }
    #[Route('/deleteProfile', name: 'deleteProfile', methods: "DELETE")]
    public function deleteProfile(
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
}
