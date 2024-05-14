<?php

namespace App\Controller;

use App\Repository\CartRepository;
use App\Repository\EbookRepository;
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
use App\Entity\CartItems;
use App\Repository\CartItemsRepository;
use Doctrine\ORM\EntityManager;

class PanierController extends AbstractController
{

    #[Route('/panier', name: 'panier_utilisateur')]
    public function panier(
        JWTEncoderInterface $JWTInterface,
        Request $request,
        UserRepository $userRepository,
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
            $cartItems = $userCart->getCartItems();
            $items = [];
            foreach ($cartItems as $cartItem) {
                $ebook = $cartItem->getEbook();
                if ($ebook) {
                    $items[] = [
                        'id' => $cartItem->getId(),
                        'name' => $ebook->getTitle(),
                        'price' => $cartItem->getPrice(),
                        'quantity' => $cartItem->getQuantity(),
                        'picture' => 'http://localhost:8000/images/couvertures/' . $ebook->getPicture(),
                    ];
                }
            }
            return new JsonResponse([
                'items' => $items,
            ]);
        }
    }
    #[Route('/add_panier/{id}', name: 'addPanier')]
    public function addPanier(int $id, Request $request, EbookRepository $ebookRepository, JWTEncoderInterface $JWTInterface, UserRepository $userRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $ebook = $ebookRepository->findOneBy(['id' => $id]);
        $authHeaders = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $authHeaders);
        $decodedToken = $JWTInterface->decode($token);
        $userId = $decodedToken["id"];
        $user = $userRepository->find($userId);
        if (!$user) {
            return new JsonResponse(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
        }
        $cartItems = $user->getCart()->getCartItems();
        $cartItemFound = null;
        foreach ($cartItems as $cartItem) {
            if ($cartItem->getEbook() === $ebook) {
                $cartItemFound = $cartItem;
                break;
            }
        }
        if ($cartItemFound) {
            $quantity = $cartItemFound->getQuantity();
            $cartItemFound->setQuantity($quantity + 1);
        } else {
            $cartItem = new CartItems();
            $cartItem->setEbook($ebook);
            $cartItem->setPrice($ebook->getPrice());
            $cartItem->setQuantity(1);
            $cartItem->setCreatedAt(new \DateTimeImmutable());
            $cartItem->setUpdatedAt(new \DateTimeImmutable());
            $user->getCart()->addCartItem($cartItem);
        }
        $entityManager->persist($cartItem);
        $entityManager->flush();
        return new JsonResponse($user->getCart());
    }
    #[Route('/remove_panier/{id}', name: 'removePanier')]
    public function removePanier(int $id, Request $request, CartItemsRepository $cartItemsRepository, JWTEncoderInterface $JWTInterface, UserRepository $userRepository, EntityManagerInterface $entityManager, CartRepository $cartRepository): JsonResponse
    {
        // Récupérer l'utilisateur à partir du token JWT
        $authHeaders = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $authHeaders);
        $decodedToken = $JWTInterface->decode($token);
        $userId = $decodedToken["id"];

        $user = $userRepository->find($userId);
        $userCart = $user->getCart();
        if ($userCart) {
            // Récupérer les éléments du panier associés à ce panier
            $cartItems = $userCart->getCartItems();
            $cartItemDeleted = $cartItemsRepository->findOneBy(['id' => $id]);
            foreach ($cartItems as $cartItem) {
                // Vérifier si l'élément du panier correspond à l'ID spécifié
                if ($cartItem->getId() === $id) {
                    $entityManager->remove($cartItem);
                    $entityManager->flush();
                    return new JsonResponse(['message' => 'Cart item successfully removed']);
                }
            }
        }

        return new JsonResponse(['message' => 'Cart item not found'], Response::HTTP_NOT_FOUND);
    }
    #[Route('/add_quantity/{id}', name: 'addQuantity')]
    public function addQuantity(int $id, Request $request, CartItemsRepository $cartItemsRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        $cartItem = $cartItemsRepository->find($id);
        if (!$cartItem) {
            return new JsonResponse(['message' => 'Cart item not found'], Response::HTTP_NOT_FOUND);
        }
        $quantity = $cartItem->getQuantity();
        $cartItem->setQuantity($quantity + 1);

        $entityManager->flush();
        return new JsonResponse($cartItem);
    }

    #[Route('/remove_quantity/{id}', name: 'removeQuantity')]
    public function removeQuantity(int $id, Request $request, CartItemsRepository $cartItemsRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        $cartItem = $cartItemsRepository->find($id);
        if (!$cartItem) {
            return new JsonResponse(['message' => 'Cart item not found'], Response::HTTP_NOT_FOUND);
        }
        $quantity = $cartItem->getQuantity();
        if ($quantity > 1) {
            $cartItem->setQuantity($quantity - 1);
        } else {
            $entityManager->remove($cartItem);
        }
        $entityManager->flush();
        if ($quantity > 1) {
            return new JsonResponse($cartItem);
        } else {
            return new JsonResponse(['message' => 'Cart item removed successfully']);
        }
    }
}
