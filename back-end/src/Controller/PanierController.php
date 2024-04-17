<?php

namespace App\Controller;

use App\Repository\CartRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\TokenExtractor\TokenExtractorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

class PanierController extends AbstractController
{

    #[Route('/panier', name: 'panier_utilisateur')]
    public function panier(
        JWTEncoderInterface $JWTInterface,
        Request $request,
        UserRepository $userRepository,
        CartRepository $cartRepository
    ): JsonResponse {
        $authHeaders = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $authHeaders);

        $decodedtoken = $JWTInterface->decode($token);
        $userId = $decodedtoken["id"];

        $user = $userRepository->find($userId);
        if (!$user) {
            return new JsonResponse(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
        }
        $userCart = $user->getCart();
        if ($userCart) {
            // Récupérer les éléments du panier associés à ce panier
            $cartItems = $userCart->getCartItems();

            // Maintenant, vous pouvez parcourir les éléments du panier
            $items = [];
            foreach ($cartItems as $cartItem) {
                $ebook = $cartItem->getEbookId();
                if ($ebook) {
                    $items[] = [
                        'id' => $cartItem->getId(),
                        'name' => $ebook->getTitle(), // Nom du livre
                        'price' => $cartItem->getPrice(),
                        'quantity' => $cartItem->getQuantity(),
                        'picture' => 'http://localhost:8000/images/couvertures/' . $ebook->getPicture(),
                    ];
                }
            }

            // Construire la réponse JSON
            return new JsonResponse([
                'items' => $items,
            ]);
        }
    }
}
