<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\Cart;
use App\Entity\UserLibrary;
use App\Repository\CartRepository;

class SecurityController extends AbstractController
{
    #[Route('/register', name: 'register', methods: ['POST'])]
    public function register(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $username = $data['username'] ?? null;
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        // Validation des données
        if (!$username || !$email || !$password) {
            return new JsonResponse(['message' => 'Tous les champs sont obligatoires.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Vérification de l'existence de l'utilisateur
        $userRepository = $entityManager->getRepository(User::class);
        if ($userRepository->findOneBy(['email' => $email])) {
            return new JsonResponse(['message' => 'Cet e-mail est déjà utilisé.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Création de l'utilisateur
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($passwordHasher->hashPassword($user, $password));
        $user->setRoles(["ROLE_USER"]);



        // Création du panier pour l'utilisateur
        $cart = new Cart();
        $cart->setStatus("pending");
        $cart->setCreatedAt(new \DateTimeImmutable());
        $cart->setUpdatedAt(new \DateTimeImmutable());
        $cart->setUser($user);

        //Création de la librairie
        $librairy = new UserLibrary();
        $librairy->setUser($user);

        // Enregistrement des données dans la base de données

        $entityManager->persist($user);
        $entityManager->persist($cart);
        $entityManager->persist($librairy);
        $entityManager->flush();


        return new JsonResponse(['message' => 'Votre compte a bien été créé'], JsonResponse::HTTP_CREATED);
    }



    #[Route('/login', name: 'login', methods: "POST")]
    public function login(Request $request, UserRepository $userRepository, JWTEncoderInterface $jwtEncoder, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'];
        $password = $data['password'];


        $user = $userRepository->findOneBy(['email' => $email]);
        if (!$user || !$passwordHasher->isPasswordValid($user, $password)) {
            return new JsonResponse(['message' => 'Les informations fournies ne sont pas correctes.'], Response::HTTP_UNAUTHORIZED);
        }

        $payload = [
            'email' => $user->getEmail(),
            'id' => $user->getId(),
            'role' => $user->getRoles()

        ];

        // Encodez le payload pour obtenir le token JWT complet
        $token = $jwtEncoder->encode($payload);

        return new JsonResponse([
            'token' => $token,
        ]);
    }
}
