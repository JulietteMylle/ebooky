<?php

namespace App\Controller;

use App\Repository\EbookRepository;
use App\Repository\OrderRepository;
use App\Repository\UserRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class CommandesController extends AbstractController
{
    #[Route('/userCommandes', name: 'userCommandes', methods: 'GET')]
    public function userCommandes(EbookRepository $ebookRepository, OrderRepository $orderRepository, Request $request, JWTEncoderInterface $JWTInterface, UserRepository $userRepository): JsonResponse
    {
        $authHeaders = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $authHeaders);

        $decodedtoken = $JWTInterface->decode($token);
        $userId = $decodedtoken["id"];
        $user = $userRepository->find($userId);

        $userOrders = $orderRepository->findBy(['userId' => $userId]);
        $userOrdersData = [];

        foreach ($userOrders as $order) {
            // Réinitialiser les données de commande à chaque itération
            $orderData = [];

            foreach ($order->getOrderLines() as $orderLine) {
                // Ajouter les détails de l'article à la commande
                $ebook = $ebookRepository->find($orderLine->getEbookId());
                if ($ebook) {
                    $authors = [];
                    foreach ($ebook->getAuthors() as $author) {
                        $authors[] = $author->getFullName();
                    }
                    // Ajouter les détails de l'ebook à la commande
                    $orderData['orderLines'][] = [
                        'ebook_id' => $ebook->getId(),
                        'ebook_title' => $ebook->getTitle(),
                        'ebook_authors' => $authors,
                        'picture' => 'https://localhost:8000/images/couvertures/' . $ebook->getPicture(),
                        // Ajouter d'autres détails de l'ebook ici
                    ];
                } else {
                    // L'ebook n'a pas été trouvé
                    $orderData['orderLines'][] = [
                        'ebook_id' => $orderLine->getEbookId(),
                        'ebook_title' => 'Ebook non trouvé',
                        // Ajouter d'autres détails de l'article ici
                    ];
                }
            }

            // Ajouter les détails de la commande au tableau des données des commandes
            $userOrdersData[] = $orderData;
        }
        return new JsonResponse($userOrdersData);
    }
}
