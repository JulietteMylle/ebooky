<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\EbookRepository;

class EbooksController extends AbstractController
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
                $authors[] = $author->getFullName();
            }

            // Créer un tableau associatif pour stocker les informations de l'ebook
            $bookData = [
                'id' => $book->getId(),
                'title' => $book->getTitle(),
                'price' => $book->getPrice(),
                'authors' => $authors,
                'picture' => 'https://localhost:8000/images/couvertures/' . $book->getPicture(),

            ];

            // Ajouter les informations de cet ebook au tableau principal
            $booksData[] = $bookData;
        }

        // Retourner une réponse JSON avec les informations de tous les ebooks
        return new JsonResponse($booksData);
    }

    #[Route('/ebooks/{id}', name: 'ebook_details', methods: ['GET'])]
    public function ebookDetails(EbookRepository $ebookRepository, $id): JsonResponse
    {
        $book = $ebookRepository->find($id);

        if (!$book) {
            return $this->json(['message' => 'Book not found'], 404);
        }

        $authors = [];
        foreach ($book->getAuthors() as $author) {
            $authors[] = $author->getFullName();
        }

        $bookData = [
            'title' => $book->getTitle(),
            'price' => $book->getPrice(),
            'authors' => $authors,
            'description' => $book->getDescription(),
            'picture' => 'http://localhost:8000/images/couvertures/' . $book->getPicture(),
        ];

        // Récupérer le publisher de l'ebook
        $publisher = $book->getPublisher();
        if ($publisher) {
            // Attribuer directement le nom du publisher à la clé 'publisher'
            $bookData['publisher'] = $publisher->getName();
        }

        return new JsonResponse($bookData);
    }
}
