<?php

namespace App\Entity;

use App\Repository\UserLibraryRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use phpDocumentor\Reflection\PseudoTypes\False_;
use phpDocumentor\Reflection\Types\Boolean;

#[ORM\Entity(repositoryClass: UserLibraryRepository::class)]
class UserLibrary
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToOne(inversedBy: 'userLibrary', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    /**
     * @var Collection<int, Ebook>
     */
    #[ORM\ManyToMany(targetEntity: Ebook::class)]
    private Collection $ebook;

    #[ORM\Column]
    private ?bool $favorite = null;

    #[ORM\OneToOne(mappedBy: 'userLibrary', cascade: ['persist', 'remove'])]
    private ?FavoriteBooks $favoriteBooks = null;

    public function __construct()
    {
        $this->ebook = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user): static
    {
        $this->user = $user;

        return $this;
    }

    /**
     * @return Collection<int, Ebook>
     */
    public function getEbook(): Collection
    {
        return $this->ebook;
    }

    public function addEbook(Ebook $ebook): static
    {
        if (!$this->ebook->contains($ebook)) {
            $this->ebook->add($ebook);
        }

        return $this;
    }

    public function removeEbook(Ebook $ebook): static
    {
        $this->ebook->removeElement($ebook);

        return $this;
    }

    public function isFavorite(): ?bool
    {
        return $this->favorite;
    }

    public function setFavorite(bool $favorite): static
    {
        $this->favorite = $favorite;

        return $this;
    }

    public function getFavoriteBooks(): ?FavoriteBooks
    {
        return $this->favoriteBooks;
    }

    public function setFavoriteBooks(?FavoriteBooks $favoriteBooks): static
    {
        // unset the owning side of the relation if necessary
        if ($favoriteBooks === null && $this->favoriteBooks !== null) {
            $this->favoriteBooks->setUserLibrary(null);
        }

        // set the owning side of the relation if necessary
        if ($favoriteBooks !== null && $favoriteBooks->getUserLibrary() !== $this) {
            $favoriteBooks->setUserLibrary($this);
        }

        $this->favoriteBooks = $favoriteBooks;

        return $this;
    }
}
