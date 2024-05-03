<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class StripeController extends AbstractController
{
    #[Route('/panier/pay', name: 'panier_pay', methods: "POST")]
    public function panier_pay(Request $request, JWTEncoderInterface $JWTInterface, UserRepository $userRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $authHeaders = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $authHeaders);

        $decodedToken = $JWTInterface->decode($token);
        $userId = $decodedToken["id"];

        $user = $userRepository->find($userId);

        // Récupérez cartData du corps de la requête POST
        $totalPrice = $data['totalPrice'];

        // Convertir le montant total en centimes


        // Configurez votre clé secrète Stripe
        $stripeSecretKey = $_ENV['STRIPE_SECRET_KEY'];
        Stripe::setApiKey($stripeSecretKey);

        // Récupérez le clientSecret de l'intention de paiement
        /* $intent = PaymentIntent::retrieve($data['paymentMethod']['clientSecret']);
        $intent->confirm(); */

        // Créez une intention de paiement (PaymentIntent)
        $paymentIntent = PaymentIntent::create([
            'amount' => $totalPrice, // Montant en centimes
            'currency' => 'eur', // Devise
        ]);

        // Récupérez le clientSecret de l'intention de paiement
        $clientSecret = $paymentIntent->client_secret;

        // Envoyez le clientSecret au client (par exemple, en tant que réponse JSON)
        return new JsonResponse(['clientSecret' =>  $clientSecret, 'totalPrice' => $totalPrice]);
    }
}
