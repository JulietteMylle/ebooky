<?php


namespace App\Controller;

use App\Entity\Ebook;
use App\Repository\EbookRepository;
use PHPUnit\Util\Json;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

class BookController extends AbstractController
{
    #[Route('/books', name: 'books', methods: "GET")]
    public function allBooks(EbookRepository $ebookRepository): JsonResponse
    {

        $ebooks = $ebookRepository->findAll();
        $ebooksData = [];

        foreach ($ebooks as $ebook) {

            $ebookData = [
                'title' => $ebook->getTitle(),
                // 'author' => $ebook->getAuthors()->isEmpty() ? null : $ebook->getAuthors()->first()->getName(),

                // 'category' => $ebook->getCategory()->isEmpty() ? null : $ebook->getCategory()->firste()->getName(),

            ];

            $ebooksData[] = $ebookData;
        };
        // Retourner les ebooks au format JSON

        return new JsonResponse($ebooksData);
    }
}
