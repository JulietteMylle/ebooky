<?php

namespace App\Entity;

use App\Repository\EbookRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EbookRepository::class)]
class Ebook
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(length: 255)]
    private ?string $picture = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $publicationDate = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $description = null;

    #[ORM\Column]
    private ?int $numberPages = null;

    #[ORM\Column]
    private ?float $price = null;

    #[ORM\ManyToOne(inversedBy: 'ebooks')]
    private ?Publisher $publisher = null;

    #[ORM\Column(length: 255)]
    private ?string $status = null;

    #[ORM\ManyToMany(targetEntity: Author::class, mappedBy: 'ebooksIds', cascade: ["remove"])]
    private Collection $authors;

    #[ORM\OneToMany(targetEntity: File::class, mappedBy: 'ebookId')]
    private Collection $files;

    #[ORM\ManyToMany(targetEntity: Category::class, mappedBy: 'ebookIds', cascade: ["remove"])]
    private Collection $categories;

    #[ORM\OneToMany(targetEntity: Review::class, mappedBy: 'ebookId')]
    private Collection $reviews;

    /**
     * @var Collection<int, UserLibrary>
     */
    #[ORM\ManyToMany(targetEntity: UserLibrary::class, mappedBy: 'ebooks')]
    private Collection $userLibraries;

    // /**
    //  * @var Collection<int, MyLibrary>
    //  */
    // #[ORM\ManyToMany(targetEntity: MyLibrary::class, mappedBy: 'ebooks')]
    // private Collection $myLibraries;

    /**
     * @var Collection<int, CartItems>
     */
    #[ORM\OneToMany(targetEntity: CartItems::class, mappedBy: 'ebook')]
    private Collection $cartItems;

    public function __construct()
    {
        $this->authors = new ArrayCollection();
        $this->files = new ArrayCollection();
        $this->categories = new ArrayCollection();
        $this->reviews = new ArrayCollection();
        $this->userLibraries = new ArrayCollection();
        $this->cartItems = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getPicture(): ?string
    {
        return $this->picture;
    }

    public function setPicture(string $picture): static
    {
        $this->picture = $picture;

        return $this;
    }

    public function getPublicationDate(): ?\DateTimeInterface
    {
        return $this->publicationDate;
    }

    public function setPublicationDate(\DateTimeInterface $publicationDate): static
    {
        $this->publicationDate = $publicationDate;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getNumberPages(): ?int
    {
        return $this->numberPages;
    }

    public function setNumberPages(int $numberPages): static
    {
        $this->numberPages = $numberPages;

        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): static
    {
        $this->price = $price;

        return $this;
    }

    public function getPublisher(): ?Publisher
    {
        return $this->publisher;
    }

    public function setPublisher(?Publisher $publisher): static
    {
        $this->publisher = $publisher;

        return $this;
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
     * @return Collection<int, Author>
     */
    public function getAuthors(): Collection
    {
        return $this->authors;
    }

    public function addAuthor(Author $author): static
    {
        if (!$this->authors->contains($author)) {
            $this->authors->add($author);
            $author->addEbooksId($this);
        }

        return $this;
    }

    public function removeAuthor(Author $author): static
    {
        if ($this->authors->removeElement($author)) {
            $author->removeEbooksId($this);
        }

        return $this;
    }

    /**
     * @return Collection<int, File>
     */
    public function getFiles(): Collection
    {
        return $this->files;
    }

    public function addFile(File $file): static
    {
        if (!$this->files->contains($file)) {
            $this->files->add($file);
            $file->setEbookId($this);
        }

        return $this;
    }

    public function removeFile(File $file): static
    {
        if ($this->files->removeElement($file)) {
            // set the owning side to null (unless already changed)
            if ($file->getEbookId() === $this) {
                $file->setEbookId(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Category>
     */
    public function getCategories(): Collection
    {
        return $this->categories;
    }

    public function addCategory(Category $category): static
    {
        if (!$this->categories->contains($category)) {
            $this->categories->add($category);
            $category->addEbookId($this);
        }

        return $this;
    }

    public function removeCategory(Category $category): static
    {
        if ($this->categories->removeElement($category)) {
            $category->removeEbookId($this);
        }

        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): static
    {
        if (!$this->users->contains($user)) {
            $this->users->add($user);
        }

        return $this;
    }

    public function removeUser(User $user): static
    {
        if ($this->users->removeElement($user)) {
        }

        return $this;
    }

    public function getCartItems(): ?CartItems
    {
        return $this->cartItems;
    }

    public function setCartItems(CartItems $cartItems): static
    {
        // set the owning side of the relation if necessary
        if ($cartItems->getEbookId() !== $this) {
            $cartItems->setEbookId($this);
        }

        $this->cartItems = $cartItems;

        return $this;
    }

    /**
     * @return Collection<int, Review>
     */
    public function getReviews(): Collection
    {
        return $this->reviews;
    }

    public function addReview(Review $review): static
    {
        if (!$this->reviews->contains($review)) {
            $this->reviews->add($review);
            $review->setEbookId($this);
        }

        return $this;
    }

    public function removeReview(Review $review): static
    {
        if ($this->reviews->removeElement($review)) {
            // set the owning side to null (unless already changed)
            if ($review->getEbookId() === $this) {
                $review->setEbookId(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, UserLibrary>
     */
    public function getUserLibraries(): Collection
    {
        return $this->userLibraries;
    }

    public function addUserLibrary(UserLibrary $userLibrary): static
    {
        if (!$this->userLibraries->contains($userLibrary)) {
            $this->userLibraries->add($userLibrary);
            $userLibrary->addEbook($this);
        }

        return $this;
    }

    public function removeUserLibrary(UserLibrary $userLibrary): static
    {
        if ($this->userLibraries->removeElement($userLibrary)) {
            $userLibrary->removeEbook($this);
        }

        return $this;
    }
}

//     /**
//      * @return Collection<int, MyLibrary>
//      */
//     public function getMyLibraries(): Collection
//     {
//         return $this->myLibraries;
//     }

//     public function addMyLibrary(MyLibrary $myLibrary): static
//     {
//         if (!$this->myLibraries->contains($myLibrary)) {
//             $this->myLibraries->add($myLibrary);
//             $myLibrary->addEbook($this);
//         }

//         return $this;
//     }

//     public function removeMyLibrary(MyLibrary $myLibrary): static
//     {
//         if ($this->myLibraries->removeElement($myLibrary)) {
//             $myLibrary->removeEbook($this);
//         }

//         return $this;
//     }
// 
    /**
     * @return Collection<int, CartItems>
     */
    public function getCartItems(): Collection
    {
        return $this->cartItems;
    }

    public function addCartItem(CartItems $cartItem): static
    {
        if (!$this->cartItems->contains($cartItem)) {
            $this->cartItems->add($cartItem);
            $cartItem->setEbook($this);
        }

        return $this;
    }

    public function removeCartItem(CartItems $cartItem): static
    {
        if ($this->cartItems->removeElement($cartItem)) {
            // set the owning side to null (unless already changed)
            if ($cartItem->getEbook() === $this) {
                $cartItem->setEbook(null);
            }
        }

        return $this;
    }
}
