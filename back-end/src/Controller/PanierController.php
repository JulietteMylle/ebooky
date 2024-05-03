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
                $ebook = $cartItem->getEbook();
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
    #[Route('/add_panier/{id}', name: 'addPanier')]
    public function addPanier(int $id, Request $request, EbookRepository $ebookRepository, JWTEncoderInterface $JWTInterface, UserRepository $userRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        // Récupérer les données de la requête
        $data = json_decode($request->getContent(), true);

        // Récupérer l'ebook à partir de l'ID
        $ebook = $ebookRepository->findOneBy(['id' => $id]);

        // Récupérer l'utilisateur à partir du token JWT
        $authHeaders = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $authHeaders);
        $decodedToken = $JWTInterface->decode($token);
        $userId = $decodedToken["id"];
        $user = $userRepository->find($userId);

        // Vérifier si l'utilisateur existe
        if (!$user) {
            return new JsonResponse(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        // Parcourir manuellement les éléments du panier de l'utilisateur pour rechercher l'ebook en question
        $cartItems = $user->getCart()->getCartItems();
        $cartItemFound = null;
        foreach ($cartItems as $cartItem) {
            if ($cartItem->getEbook() === $ebook) {
                $cartItemFound = $cartItem;
                break; // Sortir de la boucle une fois que l'ebook est trouvé
            }
        }

        // Si l'ebook est déjà dans le panier, augmenter la quantité
        if ($cartItemFound) {
            $quantity = $cartItemFound->getQuantity();
            $cartItemFound->setQuantity($quantity + 1);
        } else {
            // Créer une nouvelle instance de CartItems
            $cartItem = new CartItems();
            $cartItem->setEbook($ebook);
            $cartItem->setPrice($ebook->getPrice());
            $cartItem->setQuantity(1);
            $cartItem->setCreatedAt(new \DateTimeImmutable());
            $cartItem->setUpdatedAt(new \DateTimeImmutable());
            // Ajouter le CartItems au panier de l'utilisateur
            $user->getCart()->addCartItem($cartItem);
        }
        $entityManager->persist($cartItem);
        $entityManager->flush();

        // Retourner une réponse JSON avec le panier mis à jour
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
        // Récupérer l'élément du panier à partir de son ID
        $cartItem = $cartItemsRepository->find($id);

        // Vérifier si l'élément du panier existe
        if (!$cartItem) {
            return new JsonResponse(['message' => 'Cart item not found'], Response::HTTP_NOT_FOUND);
        }

        // Augmenter la quantité de l'ebook dans le panier
        $quantity = $cartItem->getQuantity();
        $cartItem->setQuantity($quantity + 1);

        // Enregistrer les modifications dans la base de données
        $entityManager->flush();

        // Retourner une réponse JSON avec l'élément du panier mis à jour
        return new JsonResponse($cartItem);
    }

    #[Route('/remove_quantity/{id}', name: 'removeQuantity')]
    public function removeQuantity(int $id, Request $request, CartItemsRepository $cartItemsRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        // Récupérer l'élément du panier à partir de son ID
        $cartItem = $cartItemsRepository->find($id);

        // Vérifier si l'élément du panier existe
        if (!$cartItem) {
            return new JsonResponse(['message' => 'Cart item not found'], Response::HTTP_NOT_FOUND);
        }

        // Réduire la quantité de l'ebook dans le panier
        $quantity = $cartItem->getQuantity();
        if ($quantity > 1) {
            $cartItem->setQuantity($quantity - 1);
        } else {
            // Si la quantité atteint zéro, retirer l'ebook du panier
            $entityManager->remove($cartItem);
        }

        // Enregistrer les modifications dans la base de données
        $entityManager->flush();

        // Retourner une réponse JSON avec l'élément du panier mis à jour ou un message de succès si l'ebook a été retiré
        if ($quantity > 1) {
            return new JsonResponse($cartItem);
        } else {
            return new JsonResponse(['message' => 'Cart item removed successfully']);
        }
    }
}
