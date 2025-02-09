# RecycleHub

## Contexte du projet  
RecycleHub est une application de gestion de recyclage qui met en relation des particuliers et des collecteurs agréés appartenant à l’entreprise qui souhaite automatiser ses tâches.  
L’application est développée en **Angular** sous forme de **Single Page Application (SPA)**.

## Fonctionnalités principales  

### Inscription / Connexion  
- Un particulier peut s'inscrire avec :  
  - Email et mot de passe  
  - Nom et prénom  
  - Adresse complète  
  - Numéro de téléphone  
  - Date de naissance  
  - Photo de profil (optionnel)  
- Les collecteurs sont **pré-enregistrés manuellement** en local storage.  
- Un utilisateur peut **modifier** ses coordonnées et **supprimer** son compte.  

### Demande de collecte  
- Le particulier soumet une demande avec :  
  - Type de déchet à recycler (plastique, verre, papier, métal)  
  - Photos des déchets (optionnel)  
  - Poids estimé (minimum **1000g obligatoire**)  
  - Adresse de collecte  
  - Date et créneau horaire souhaités (**09h00 - 18h00**)  
  - Notes supplémentaires (optionnel)  
- Le statut de la demande est par défaut **"En attente"**, seul le collecteur peut le modifier.  
- Un particulier peut :
  - Regrouper plusieurs types de déchets dans une même demande.  
  - Avoir **3 demandes simultanées** non encore validées ou rejetées.  
  - Ne pas dépasser **10 kg** de déchets au total.  

### Processus de collecte  
- Le collecteur peut :  
  - Voir les demandes disponibles dans **sa ville**.  
  - Sélectionner une demande **"En attente"** et changer son statut.  
- Statuts possibles d’une demande :  
  - **En attente**  
  - **Occupée** (collecteur accepte la demande)  
  - **En cours** (collecteur commence la collecte)  
  - **Validée**  
  - **Rejetée**  
- Lors de la collecte, le collecteur :  
  - Vérifie les matériaux  
  - Pèse le poids réel  
  - Prend des photos (optionnel)  
  - Valide ou rejette la collecte  

### Système de points  
- Attribution automatique après validation :  
  - **Plastique** : 2 points/kg  
  - **Verre** : 1 point/kg  
  - **Papier** : 1 point/kg  
  - **Métal** : 5 points/kg  
- Conversion des points en bons d’achat :  
  - **100 points** = **50 Dh**  
  - **200 points** = **120 Dh**  
  - **500 points** = **350 Dh**  

## Technologies utilisées  
- **Angular 17+**  
- **NgRx** (gestion d’état)  
- **RxJS / Observables**  
- **Injection de dépendance**  
- **Formulaires** (Reactive Forms / Template Driven Forms)  
- **Bootstrap ou Tailwind CSS**  
- **Guards & Resolvers**  
- **Routing & Services**  
- **Validation et gestion d’erreurs**  
- **Design Responsive**  

## Installation et Exécution  
1. Cloner le projet :  
   ```sh
   git clone https://github.com/Ayounsni/RecycleHub
