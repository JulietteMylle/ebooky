<?php

namespace App\Entity;

use App\Repository\UserLibraryRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserLibraryRepository::class)]
class UserLibrary
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    /**
     * @var Collection<int, Ebook>
     */
    #[ORM\ManyToMany(targetEntity: Ebook::class, inversedBy: 'userLibraries')]
    private Collection $ebooks;

    #[ORM\OneToOne(inversedBy: 'userLibrary', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    public function __construct()
    {
        $this->ebooks = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return Collection<int, Ebook>
     */
    public function getEbooks(): Collection
    {
        return $this->ebooks;
    }

    public function addEbook(Ebook $ebook): static
    {
        if (!$this->ebooks->contains($ebook)) {
            $this->ebooks->add($ebook);
        }

        return $this;
    }

    public function removeEbook(Ebook $ebook): static
    {
        $this->ebooks->removeElement($ebook);

        return $this;
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
}
