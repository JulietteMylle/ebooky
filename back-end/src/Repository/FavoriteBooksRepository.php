<?php

namespace App\Repository;

use App\Entity\FavoriteBooks;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<FavoriteBooks>
 *
 * @method FavoriteBooks|null find($id, $lockMode = null, $lockVersion = null)
 * @method FavoriteBooks|null findOneBy(array $criteria, array $orderBy = null)
 * @method FavoriteBooks[]    findAll()
 * @method FavoriteBooks[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FavoriteBooksRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, FavoriteBooks::class);
    }

    //    /**
    //     * @return FavoriteBooks[] Returns an array of FavoriteBooks objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('f')
    //            ->andWhere('f.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('f.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?FavoriteBooks
    //    {
    //        return $this->createQueryBuilder('f')
    //            ->andWhere('f.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
