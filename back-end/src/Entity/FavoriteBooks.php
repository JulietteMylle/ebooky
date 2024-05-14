<?php

namespace App\Entity;

use App\Repository\FavoriteBooksRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FavoriteBooksRepository::class)]
class FavoriteBooks
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    /**
     * @var Collection<int, User>
     */
    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'favoriteBooks')]
    private Collection $user;

    /**
     * @var Collection<int, Ebook>
     */
    #[ORM\ManyToMany(targetEntity: Ebook::class, inversedBy: 'favoriteBooks')]
    private Collection $ebook;

    #[ORM\OneToOne(inversedBy: 'favoriteBooks', cascade: ['persist', 'remove'])]
    private ?UserLibrary $userLibrary = null;

    #[ORM\Column]
    private ?bool $is_favorite = null;

    public function __construct()
    {
        $this->user = new ArrayCollection();
        $this->ebook = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return Collection<int, User>
     */
    public function getUser(): Collection
    {
        return $this->user;
    }

    public function addUser(User $user): static
    {
        if (!$this->user->contains($user)) {
            $this->user->add($user);
        }

        return $this;
    }

    public function removeUser(User $user): static
    {
        $this->user->removeElement($user);

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

    public function getUserLibrary(): ?UserLibrary
    {
        return $this->userLibrary;
    }

    public function setUserLibrary(?UserLibrary $userLibrary): static
    {
        $this->userLibrary = $userLibrary;

        return $this;
    }

    public function isFavorite(): ?bool
    {
        return $this->is_favorite;
    }

    public function setFavorite(bool $is_favorite): static
    {
        $this->is_favorite = $is_favorite;

        return $this;
    }
}
