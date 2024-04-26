<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240425090106 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE ebook DROP FOREIGN KEY ebook_ibfk_1');
        $this->addSql('DROP INDEX author_id ON ebook');
        $this->addSql('ALTER TABLE ebook DROP author_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE ebook ADD author_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE ebook ADD CONSTRAINT ebook_ibfk_1 FOREIGN KEY (author_id) REFERENCES author (id)');
        $this->addSql('CREATE INDEX author_id ON ebook (author_id)');
    }
}
