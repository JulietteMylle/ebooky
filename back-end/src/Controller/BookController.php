<?php

namespace App\Controller;

use App\Entity\Ebook;
use App\Repository\EbookRepository;
use PHPUnit\Util\Json;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;


class BookController extends AbstractController
{
    #[Route('/books', name: 'books', methods: "GET")]
    public function allBooks(EbookRepository $ebookRepository): JsonResponse
    {

        $ebooks = $ebookRepository->findAll();
        $ebooksData = [];

        foreach ($ebooks as $ebook) {

            $authorsData = [];
            foreach ($ebook->getAuthors() as $author) {
                $authorsData[] = [
                    'id' => $author->getId(),
                    'fullName' => $author->getFullName(),
                    'biography' => $author->getBiography(),

                ];
            }
            $categoriesData = [];
            foreach ($ebook->getCategories() as $category) {
                $categoriesData[] = [
                    'id' => $category->getId(),
                    'name' => $category->getName(),
                ];
            }

            $ebookData = [
                'title' => $ebook->getTitle(),
                'id' => $ebook->getId(),
                'picture' => 'https://localhost:8000/images/couvertures/' . $ebook->getPicture(),
                'description' => $ebook->getDescription(),
                'category' => $categoriesData,
                'authors' => $authorsData,

            ];

            $ebooksData[] = $ebookData;
        }

        // Retourner les ebooks au format JSON

        return new JsonResponse($ebooksData);
    }


    #[Route('/books/{id}', name: 'book_show', methods: ['GET'])]
    public function show(int $id, EbookRepository $ebookRepository): JsonResponse
    {

        $ebook = $ebookRepository->find($id);


        if (!$ebook) {
            // Retournez une réponse JSON avec un message d'erreur si l'ebook n'est pas trouvé
            return new JsonResponse(['error' => 'Ebook not found'], Response::HTTP_NOT_FOUND);
        }


        $authorsData = [];
        foreach ($ebook->getAuthors() as $author) {
            $authorsData[] = [
                'id' => $author->getId(),
                'fullName' => $author->getFullName(),
                'biography' => $author->getBiography(),
            ];
        }

        $categoriesData = [];
        foreach ($ebook->getCategories() as $category) {
            $categoriesData[] = [
                'id' => $category->getId(),
                'name' => $category->getName(),
            ];
        }

        $ebookData = [
            'title' => $ebook->getTitle(),
            'id' => $ebook->getId(),
            'picture' => 'https://localhost:8000/images/couvertures/' . $ebook->getPicture(),
            'description' => $ebook->getDescription(),
            'authors' => $authorsData,

        ];

        // Retournez une réponse JSON 
        return new JsonResponse($ebookData);
    }
}
