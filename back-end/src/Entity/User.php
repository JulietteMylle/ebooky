<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    private ?string $email = null;

    #[ORM\Column]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    #[ORM\Column(length: 255)]
    private ?string $username = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

        return $this;
    }
    #[ORM\OneToOne(targetEntity: Cart::class, mappedBy: 'user', cascade: ['persist', 'remove'])]
    private ?Cart $cart = null;

    #[ORM\OneToOne(mappedBy: 'user', cascade: ['persist', 'remove'])]
    private ?UserLibrary $userLibrary = null;

    /**
     * @var Collection<int, FavoriteBooks>
     */
    #[ORM\ManyToMany(targetEntity: FavoriteBooks::class, mappedBy: 'user')]
    private Collection $favoriteBooks;

    public function __construct()
    {
        $this->favoriteBooks = new ArrayCollection();
    }

    public function getCart(): ?Cart
    {
        return $this->cart;
    }

    public function setCart(?Cart $cart): self
    {
        $this->cart = $cart;
        return $this;
    }

    public function getUserLibrary(): ?UserLibrary
    {
        return $this->userLibrary;
    }

    public function setUserLibrary(UserLibrary $userLibrary): static
    {
        // set the owning side of the relation if necessary
        if ($userLibrary->getUser() !== $this) {
            $userLibrary->setUser($this);
        }

        $this->userLibrary = $userLibrary;

        return $this;
    }

    /**
     * @return Collection<int, FavoriteBooks>
     */
    public function getFavoriteBooks(): Collection
    {
        return $this->favoriteBooks;
    }

    public function addFavoriteBook(FavoriteBooks $favoriteBook): static
    {
        if (!$this->favoriteBooks->contains($favoriteBook)) {
            $this->favoriteBooks->add($favoriteBook);
            $favoriteBook->addUser($this);
        }

        return $this;
    }

    public function removeFavoriteBook(FavoriteBooks $favoriteBook): static
    {
        if ($this->favoriteBooks->removeElement($favoriteBook)) {
            $favoriteBook->removeUser($this);
        }

        return $this;
    }
}
