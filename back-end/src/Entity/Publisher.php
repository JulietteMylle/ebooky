<?php

namespace App\Entity;

use App\Repository\PublisherRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PublisherRepository::class)]
class Publisher
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $details = null;

    #[ORM\OneToMany(targetEntity: ebook::class, mappedBy: 'publisher')]
    private Collection $ebooks;

    public function __construct()
    {
        $this->ebooks = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getDetails(): ?string
    {
        return $this->details;
    }

    public function setDetails(string $details): static
    {
        $this->details = $details;

        return $this;
    }

    /**
     * @return Collection<int, ebook>
     */
    public function getEbooks(): Collection
    {
        return $this->ebooks;
    }

    public function addEbooks(ebook $ebooks): static
    {
        if (!$this->ebooks->contains($ebooks)) {
            $this->ebooks->add($ebooks);
            $ebooks->setPublisher($this);
        }

        return $this;
    }

    public function removeEbooks(ebook $ebooks): static
    {
        if ($this->ebooks->removeElement($ebooks)) {
            // set the owning side to null (unless already changed)
            if ($ebooks->getPublisher() === $this) {
                $ebooks->setPublisher(null);
            }
        }

        return $this;
    }
}
