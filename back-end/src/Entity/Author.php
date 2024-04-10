<?php

namespace App\Entity;

use App\Repository\AuthorRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AuthorRepository::class)]
class Author
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $fullName = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $biography = null;

    #[ORM\ManyToMany(targetEntity: Ebook::class, inversedBy: 'authors')]
    private Collection $ebooksIds;

    public function __construct()
    {
        $this->ebooksIds = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFullName(): ?string
    {
        return $this->fullName;
    }

    public function setFullName(string $fullName): static
    {
        $this->fullName = $fullName;

        return $this;
    }

    public function getBiography(): ?string
    {
        return $this->biography;
    }

    public function setBiography(?string $biography): static
    {
        $this->biography = $biography;

        return $this;
    }

    /**
     * @return Collection<int, Ebook>
     */
    public function getEbooksIds(): Collection
    {
        return $this->ebooksIds;
    }

    public function addEbooksId(Ebook $ebooksId): static
    {
        if (!$this->ebooksIds->contains($ebooksId)) {
            $this->ebooksIds->add($ebooksId);
        }

        return $this;
    }

    public function removeEbooksId(Ebook $ebooksId): static
    {
        $this->ebooksIds->removeElement($ebooksId);

        return $this;
    }
}
