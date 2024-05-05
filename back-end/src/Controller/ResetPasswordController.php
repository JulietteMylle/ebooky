<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\ChangePasswordFormType;
use App\Form\ResetPasswordRequestFormType;
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

    public function __construct(
        private ResetPasswordHelperInterface $resetPasswordHelper,
        private EntityManagerInterface $entityManager
    ) {
    }

    /**
     * Display & process form to request a password reset.
     */
    #[Route('/resetPassword', name: 'ResetPassword', methods: ['POST'], format: 'json')]
    public function ResetPassword(Request $request, MailerInterface $mailer, TranslatorInterface $translator): JsonResponse
    {
        $formData = json_decode($request->getContent(), true);

        // Vérifiez si le champ 'email' existe dans les données
        if (isset($formData['email'])) {
            $adresseemail = $formData['email'];
            $user = $this->entityManager->getRepository(User::class)->findOneBy([
                'email' => $adresseemail,
            ]);

            if (!$user) {
                return new JsonResponse([
                    'error' => 'User not found'
                ], JsonResponse::HTTP_NOT_FOUND);
            }

            try {
                $resetToken = $this->resetPasswordHelper->generateResetToken($user);

                $emailContent = $this->renderView('email.html.twig', [
                    'resetToken' => $resetToken,
                ]);

                $email = (new TemplatedEmail())
                    ->from(new Address('ebooky.contact@gmail.com', 'Ebooky'))
                    ->to($adresseemail)
                    ->subject('Password reset request')
                    ->html($emailContent);

                $mailer->send($email);
            } catch (ResetPasswordExceptionInterface $e) {
                return new JsonResponse([
                    'error' => 'Failed to generate reset token'
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
            } catch (TransportExceptionInterface $e) {
                return new JsonResponse([
                    'error' => 'Failed to send password reset email'
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
            }

            // Store the token object in session for retrieval in check-email route.
            $this->setTokenObjectInSession($resetToken);

            return new JsonResponse([
                'message' => 'Password reset email sent successfully'
            ]);
        }
    }

    /**
     * Confirmation page after a user has requested a password reset.
     */
    // #[Route('/check-email', name: 'app_check_email', format: 'json')]
    // public function checkEmail(): JsonResponse
    // {
    //     return new JsonResponse([
    //         'message' => 'Check your email for a password reset link'
    //     ]);
    // }

    /**
     * Validates and process the reset URL that the user clicked in their email.
     */
    #[Route('/reset/{token}', name: 'app_reset_password', format: 'json')]
    public function reset(Request $request, UserPasswordHasherInterface $passwordHasher, TranslatorInterface $translator, ?string $token = null): JsonResponse
    {
        if ($token) {
            $this->storeTokenInSession($token);

            // Logic for resetting the password based on the token goes here
            // For example:
            // 1. Validate the token and fetch the user
            // 2. Handle password reset process
            // 3. Return appropriate JSON response

            $token = $this->getTokenFromSession();

            if (null === $token) {
                return new JsonResponse([
                    'error' => 'No reset password token found in the session.'
                ], JsonResponse::HTTP_BAD_REQUEST);
            }

            try {
                $user = $this->resetPasswordHelper->validateTokenAndFetchUser($token);
            } catch (ResetPasswordExceptionInterface $e) {
                return new JsonResponse([
                    'error' => 'Failed to validate reset password token.'
                ], JsonResponse::HTTP_BAD_REQUEST);
            }

            // Handle the password reset process
            $form = $this->createForm(ChangePasswordFormType::class);
            $form->handleRequest($request);

            if ($form->isSubmitted() && $form->isValid()) {
                // A password reset token should be used only once, remove it.
                $this->resetPasswordHelper->removeResetRequest($token);

                // Encode the plain password and set it
                $encodedPassword = $passwordHasher->hashPassword(
                    $user,
                    $form->get('plainPassword')->getData()
                );

                $user->setPassword($encodedPassword);
                $this->entityManager->flush();

                // Clean the session after password reset
                $this->cleanSessionAfterReset();

                return new JsonResponse([
                    'message' => 'Password reset successfully'
                ]);
            }

            return new JsonResponse([
                'error' => 'Invalid form submission'
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        return new JsonResponse([
            'error' => 'Invalid token'
        ], JsonResponse::HTTP_BAD_REQUEST);
    }

    private function processSendingPasswordResetEmail(string $emailFormData, MailerInterface $mailer, TranslatorInterface $translator): JsonResponse
    {
        $user = $this->entityManager->getRepository(User::class)->findOneBy([
            'email' => $emailFormData,
        ]);

        if (!$user) {
            return new JsonResponse([
                'error' => 'User not found'
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        try {
            $resetToken = $this->resetPasswordHelper->generateResetToken($user);
        } catch (ResetPasswordExceptionInterface $e) {
            return new JsonResponse([
                'error' => 'Failed to generate reset token'
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

        $email = (new TemplatedEmail())
            ->from(new Address('ebooky.contact@gmail.com', 'Ebooky'))
            ->to($user->getEmail())
            ->subject('Password reset request')
            ->htmlTemplate('reset_password/email.html.twig')
            ->context([
                'resetToken' => $resetToken,
            ]);

        try {
            $mailer->send($email);
        } catch (TransportExceptionInterface $e) {
            return new JsonResponse([
                'error' => 'Failed to send password reset email'
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

        // Store the token object in session for retrieval in check-email route.
        $this->setTokenObjectInSession($resetToken);

        return new JsonResponse([
            'message' => 'Password reset email sent successfully'
        ]);
    }
}
