<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\ChangePasswordFormType;
use App\Form\ResetPasswordRequestFormType;
use App\Repository\UserRepository;
use App\Service\EmailService;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Translation\TranslatorInterface;
use SymfonyCasts\Bundle\ResetPassword\Controller\ResetPasswordControllerTrait;
use SymfonyCasts\Bundle\ResetPassword\Exception\ResetPasswordExceptionInterface;
use SymfonyCasts\Bundle\ResetPassword\ResetPasswordHelperInterface;

#[Route('/reset-password')]
class ResetPasswordController extends AbstractController
{
    use ResetPasswordControllerTrait;
    private $emailService;

    public function __construct(
        private ResetPasswordHelperInterface $resetPasswordHelper,
        private EntityManagerInterface $entityManager,
        EmailService $emailService
    ) {
        $this->emailService = $emailService;
    }

    /**
     * Display & process form to request a password reset.
     */
    #[Route('/resetPassword', name: 'ResetPassword', methods: ['POST'], format: 'json')]
    public function ResetPassword(
        Request $request,
        UserRepository $userRepository,
        EntityManagerInterface $em
    ): JsonResponse {

        /* Récupérer les données, puis l'utilisateur à partir de ces données */
        $data = json_decode($request->getContent(), true);
        if ($data === null) {
            return new JsonResponse(['message' => 'Une erreur est survenue'], 404);
        }
        $user = $userRepository->findOneBy(['email' => $data['email']]);
        if (!$user) {
            return new JsonResponse(['message' => 'Si une adresse mail correspondate existe, un mail pour 
             changer votre mot de passe a été envoyé. Pensez à vérifier vos spams'], 200);
        } else {

            $randomToken = bin2hex(random_bytes(16));

            $user->setTokenReset($randomToken);
            $timestamp = time() + 86400;
            $expirationDate = (new DateTimeImmutable())->setTimestamp($timestamp);
            $user->setTokenExpires($expirationDate);
            $em->persist($user);
            $em->flush();
            $this->emailService->sendWithTemplate(
                'ebooky.contact@gmail.com',
                $user->getEmail(),
                'Réinitialisation de votre mot de passe',
                'reset_password/check_email.html.twig',
                ['randomToken' => $randomToken],
            );
            return new JsonResponse(['message' => 'Si une adresse mail correspondate existe, un mail pour 
             changer votre mot de passe a été envoyé. Pensez à vérifier vos spams'], 200);
        }
    }
    #[Route('/emailChecked', name: 'ResetPasswordAfterEmail', methods: ['POST'], format: 'json')]
    public function ResetPasswordAfterEmail(UserPasswordHasherInterface $passwordHasher, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $requestData = json_decode($request->getContent(), true);

        $token = $requestData['token'];
        $password = $requestData['password'];

        // Recherche de l'utilisateur par le token
        $user = $em->getRepository(User::class)->findOneBy(['token_reset' => $token]);

        if (!$user) {
            return new JsonResponse(['message' => 'Token invalide'], Response::HTTP_BAD_REQUEST);
        }

        // Réinitialisation du mot de passe
        $user->setPassword($passwordHasher->hashPassword($user, $password));
        $user->setTokenReset(null);
        $user->setTokenExpires(null);
        $em->flush();

        return new JsonResponse(['message' => 'Mot de passe réinitialisé avec succès'], Response::HTTP_OK);
    }
}
