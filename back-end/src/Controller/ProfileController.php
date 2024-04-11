<?php

namespace App\Controller;

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
    public function profile(Security $security, EntityManagerInterface $em, Request $request, JWTEncoderInterface $JWTInterface): JsonResponse
    {
        $authHeaders = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $authHeaders);


        $decodedtoken = $JWTInterface->decode($token);
        $email = $decodedtoken["email"];


        return new JsonResponse($email);
    }
}
