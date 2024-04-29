<?php

namespace App\Entity;

use App\Repository\MyLibraryRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: MyLibraryRepository::class)]
class MyLibrary
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $status = null;

    /**
     * @var Collection<int, Ebook>
     */
    #[ORM\ManyToMany(targetEntity: Ebook::class, inversedBy: 'myLibraries')]
    private Collection $ebooks;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    private ?User $user = null;

    public function __construct()
    {
        $this->ebooks = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
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

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }
    #[ORM\OneToOne(targetEntity: MyLibrary::class, mappedBy: 'user', cascade: ['persist', 'remove'])]
    private ?MyLibrary $myLibrary = null;

    public function getMyLibrary(): ?MyLibrary
    {
        return $this->myLibrary;
    }

    public function setMyLibrary(?MyLibrary $myLibrary): self
    {
        $this->myLibrary = $myLibrary;
        return $this;
    }
}
