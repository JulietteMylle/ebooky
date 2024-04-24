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

    #[ORM\OneToMany(targetEntity: Ebook::class, mappedBy: 'publisher')]
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

    public function addEbook(Ebook $ebook): static
    {
        if (!$this->ebooks->contains($ebook)) {
            $this->ebooks->add($ebook);
            $ebook->setPublisher($this);
        }

        return $this;
    }

    public function removeEbook(Ebook $ebook): static
    {
        if ($this->ebooks->removeElement($ebook)) {
            // set the owning side to null (unless already changed)
            if ($ebook->getPublisher() === $this) {
                $ebook->setPublisher(null);
            }
        }

        return $this;
    }
}
