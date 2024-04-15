<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\EbookRepository;

class NewEbooksController extends AbstractController
{
    #[Route('/newEbooks', name: 'newEbooks')]
    public function newEbooks(EbookRepository $ebookRepository): JsonResponse
    {
        // Récupérer les 5 derniers ebooks par ordre descendant d'ID
        $latestBooks = $ebookRepository->findBy([], ['id' => 'DESC'], 5);

        // Construire un tableau pour stocker toutes les informations des ebooks
        $booksData = [];

        // Parcourir chaque ebook et ajouter ses informations au tableau
        foreach ($latestBooks as $book) {
            // Récupérer les auteurs de l'ebook
            $authors = [];
            foreach ($book->getAuthors() as $author) {
                $authors[] = $author->getFullName(); // Supposons que la méthode getName() récupère le nom de l'auteur
            }

            // Créer un tableau associatif pour stocker les informations de l'ebook
            $bookData = [
                'title' => $book->getTitle(),
                'price' => $book->getPrice(),
                'authors' => $authors,
                'picture' => '/images/couvertures/' . $book->getPicture(),

            ];

            // Ajouter les informations de cet ebook au tableau principal
            $booksData[] = $bookData;
        }

        // Retourner une réponse JSON avec les informations de tous les ebooks
        return new JsonResponse($booksData);
    }
}
