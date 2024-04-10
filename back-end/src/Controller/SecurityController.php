<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

class SecurityController extends AbstractController
{
    #[Route('/register', name: 'register', methods: "POST")]
    public function register(EntityManagerInterface $em, Request $request, UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $username = $data['username'];

        $email = $data['email'];


        $password = $data['password'];

        // On vérifie si le visiteur est déjà dans la base de données
        $isUserInDb = $userRepository->findOneBy(['email' => $email]);
        if ($isUserInDb) {
            return new JsonResponse(['message' => 'Cet e-mail est déjà utilisé.']);
        }
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($passwordHasher->hashPassword($user, $password));
        $user->setRoles(["ROLE_USER"]);
        // attention double quote
        $em->persist($user);
        $em->flush();

        return new JsonResponse(['message' => 'Votre compte a bien été créé']);
    }
}
