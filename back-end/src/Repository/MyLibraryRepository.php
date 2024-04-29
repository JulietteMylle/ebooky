<?php

namespace App\Repository;

use App\Entity\MyLibrary;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<MyLibrary>
 *
 * @method MyLibrary|null find($id, $lockMode = null, $lockVersion = null)
 * @method MyLibrary|null findOneBy(array $criteria, array $orderBy = null)
 * @method MyLibrary[]    findAll()
 * @method MyLibrary[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MyLibraryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, MyLibrary::class);
    }

//    /**
//     * @return MyLibrary[] Returns an array of MyLibrary objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('m')
//            ->andWhere('m.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('m.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?MyLibrary
//    {
//        return $this->createQueryBuilder('m')
//            ->andWhere('m.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
