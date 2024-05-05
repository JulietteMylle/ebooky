<?php

namespace App\Controller;

use App\Entity\Comments;
use App\Repository\CommentsRepository;
use App\Repository\EbookRepository;
use App\Repository\UserRepository;
use DateTime;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class CommentsController extends AbstractController
{
    #[Route('/ebooks/${id}/newComment', name: 'newComment', methods: 'POST')]
    public function newComment(
        UserRepository $userRepository,
        Request $request,
        EbookRepository $ebookRepository,
        CommentsRepository $commentsRepository,
        JWTEncoderInterface $JWTInterface,
        int $id,
        EntityManagerInterface $entityManager,
    ): JsonResponse {
        $authHeaders = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $authHeaders);

        $decodedtoken = $JWTInterface->decode($token);
        $userId = $decodedtoken['id'];

        $user = $userRepository->find($userId);

        if (!$user) {
            return new JsonResponse(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $ebook = $ebookRepository->find($id);
        $data = json_decode($request->getContent(), true);
        $comment = new Comments();
        $comment->setContent($data['content']);
        $comment->setEbookId($ebook);
        $comment->setUserId($user);
        $comment->setDate(new DateTime());
        $entityManager->persist($comment);
        $entityManager->flush();

        return $this->json($comment, 201);
    }

    #[Route('/ebooks/{id}/comments', name: 'comments', methods: 'GET')]
    public function comments(EbookRepository $ebookRepository, int $id, CommentsRepository $commentsRepository, UserRepository $userRepository): JsonResponse
    {
        $ebook = $ebookRepository->find($id);
        if (!$ebook) {
            return new JsonResponse(['message' => 'Ebook not found'], Response::HTTP_NOT_FOUND);
        }

        $commentsIds = $ebook->getCommentsId(); // Supposons que la méthode pour récupérer les identifiants des commentaires s'appelle getCommentsId()

        // Vous pouvez ensuite formater les commentaires comme vous le souhaitez
        $formattedComments = [];
        foreach ($commentsIds as $commentId) {
            // Récupérer le commentaire en fonction de son identifiant
            $comment = $commentsRepository->find($commentId);
            if ($comment) {
                // Récupérer l'utilisateur associé à ce commentaire
                $userId = $comment->getUserId();
                // Formater le commentaire avec l'utilisateur
                $formattedComments[] = [
                    'id' => $comment->getId(),
                    'content' => $comment->getContent(),
                    'username' => $userId->getUsername(),
                    'date' => $comment->getDate(),
                    // Autres attributs de commentaire que vous voulez inclure...
                ];
            }
        }

        // Retournez les commentaires sous forme de réponse JSON
        return new JsonResponse($formattedComments);
    }
}
