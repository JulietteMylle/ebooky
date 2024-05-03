<?php

namespace App\Controller;

use App\Entity\Order;
use App\Entity\OrderLine;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
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
    #[Route('/transfererpanier', name: 'transferer_panier', methods: "POST")]
    public function transferer_panier(JWTEncoderInterface $JWTInterface, UserRepository $userRepository, Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        // Récupération de l'ID de l'utilisateur à partir du token JWT
        $authHeaders = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $authHeaders);
        $decodedToken = $JWTInterface->decode($token);
        $userId = $decodedToken["id"];

        // Récupération de l'utilisateur à partir de son ID
        $user = $userRepository->find($userId);

        // Récupération du panier de l'utilisateur
        $userCart = $user->getCart();

        // Récupération des éléments du panier
        $panierItems = $userCart->getCartItems();

        $totalPrice = 0;

        // Création d'une nouvelle commande pour l'utilisateur
        $order = new Order();
        $order->setUserId($user);
        $order->setTotalPrice($totalPrice);
        $order->setCreatedAt(new \DateTimeImmutable());
        $order->setUpdatedAt(new \DateTimeImmutable());

        // Tableau pour stocker temporairement les OrderLines
        $orderLines = [];

        // Ajout des éléments du panier à la commande
        foreach ($panierItems as $panierItem) {
            $orderLine = new OrderLine();
            $orderLine->setOrderId($order);
            $orderLine->setPrice($panierItem->getPrice());
            $orderLine->setQuantity($panierItem->getQuantity());
            $orderLine->setCreatedAt(new \DateTimeImmutable());
            $orderLine->setUpdatedAt(new \DateTimeImmutable());
            $orderLine->setEbookId($panierItem->getEbook()->getId());

            // Ajout de la ligne de commande à la commande
            $order->addOrderLine($orderLine);

            // Ajout de l'OrderLine au tableau temporaire
            $orderLines[] = $orderLine;
        }

        // Persister les OrderLines
        foreach ($orderLines as $orderLine) {
            $entityManager->persist($orderLine);
        }

        // Sauvegarde de la commande dans la base de données
        $entityManager->persist($order);
        $entityManager->flush();

        // Réponse de succès
        return new JsonResponse(['message' => 'Le contenu du panier a été transféré avec succès vers la commande.']);
    }
    #[Route('/viderpanier', name: 'vider_panier', methods: "DELETE")]
    public function vider_panier(JWTEncoderInterface $JWTInterface, UserRepository $userRepository, Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $authHeaders = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $authHeaders);
        $decodedToken = $JWTInterface->decode($token);
        $userId = $decodedToken["id"];

        // Récupération de l'utilisateur à partir de son ID
        $user = $userRepository->find($userId);

        // Récupération du panier de l'utilisateur
        $userCart = $user->getCart();

        // Récupération des éléments du panier
        $panierItems = $userCart->getCartItems();

        foreach ($panierItems as $panierItem) {
            $entityManager->remove($panierItem);
        }
        $entityManager->flush();
        return new JsonResponse(['message' => 'Le panier a été vidé avec succès.']);
    }
}
