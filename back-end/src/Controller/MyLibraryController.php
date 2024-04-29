<?php


namespace App\Controller;

use App\Entity\MyLibrary;
use App\Repository\EbookRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use App\Repository\MyLibraryRepository;
use App\Repository\UserRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;





class MyLibraryController extends AbstractController
{

    private $entityManager;
    private $ebookRepository;
    private $myLibraryRepository;
    private $userRepository;
    private $JWTInterface;


    public function __construct(

        EntityManagerInterface $entityManager,
        EbookRepository $ebookRepository,

        MyLibraryRepository $myLibraryRepository,
        UserRepository $userRepository,
        JWTEncoderInterface $JWTInterface
    ) {
        $this->entityManager = $entityManager;
        $this->ebookRepository = $ebookRepository;
        $this->myLibraryRepository = $myLibraryRepository;
        $this->userRepository = $userRepository;
        $this->JWTInterface = $JWTInterface;
    }


    #[Route('/mylibrary', name: 'addToFavoris', methods: "POST")]

    public function addToFavoris(Request $request, UserRepository $userRepository, EntityManagerInterface $entityManager, EbookRepository $ebookRepository): JsonResponse
    {

        $authHeaders = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $authHeaders);

        $decodedToken = $this->JWTInterface->decode($token);
        $email = $decodedToken['email'];

        $user = $userRepository->findOneBy(["email" => $email]);


        $myLibraryEntry = $this->myLibraryRepository->findOneBy(['user' => $user]);
        if (!$myLibraryEntry) {
            return $this->json(['message' => 'MyLibrary introuvable pour cet utilisateur'], 404);
        }
        // if (!$bookId) {
        //     return $this->json(['message' => 'Identifiant du livre non fourni dans la requête'], 400);
        // }

        $bookId = $requestData['bookId'] ?? null;
        $ebook = $ebookRepository->find($bookId);

        // Check if the ebook exists
        if (!$ebook) {
            return $this->json(['message' => 'Livre non trouvé'], 404);
        }

        return new JsonResponse(['success' => true, 'message' => 'Livre ajouté à vos favoris']);
    }



    #[Route('/mylibrary/favorites', name: 'getFavorites', methods: "GET")]
    public function getFavorites(MyLibraryRepository $myLibraryRepository, UserRepository $userRepository, Request $request, JWTEncoderInterface $JWTInterface): JsonResponse
    {
        $authHeaders = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $authHeaders);

        $decodedToken = $JWTInterface->decode($token);
        $email = $decodedToken['email'];

        $user = $userRepository->findOneBy(["email" => $email]);
        if (!$user) {
            return $this->json(['message' => 'Utilisateur introuvable'], 404);
        }

        // MyLibary du USER
        $libraryEntries = $myLibraryRepository->findOneBy(['user' => $user]);


        $favorites = [];
        foreach ($libraryEntries as $entry) {
            $ebooks = $entry->getEbooks(); // Obtenez les livres associés à l'entrée MyLibrary
            foreach ($ebooks as $ebook) {
                $favorites[] = [
                    'title' => $ebook->getTitle(),
                    // 'author' => $ebook->getAuthor()->getName(), // Suppose que l'ebook a une relation avec l'entité d'auteur
                    // Ajoutez plus d'informations au besoin
                ];
            }
        }

        return new JsonResponse(['favorites' => $favorites]);
    }
}
