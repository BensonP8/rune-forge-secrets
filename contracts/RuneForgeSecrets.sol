// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract RuneForgeSecrets is SepoliaConfig {
    using FHE for *;
    
    struct RuneRecipe {
        euint32 recipeId;
        euint32 difficulty;
        euint32 powerLevel;
        euint32 manaCost;
        bool isPublic;
        bool isVerified;
        string name;
        string description;
        string category;
        address creator;
        uint256 createdAt;
        uint256 updatedAt;
    }
    
    struct Ingredient {
        euint32 ingredientId;
        euint32 quantity;
        euint32 rarity;
        string name;
        string description;
    }
    
    struct CraftingSession {
        euint32 sessionId;
        euint32 recipeId;
        euint32 successRate;
        euint32 manaSpent;
        bool isCompleted;
        address crafter;
        uint256 startTime;
        uint256 endTime;
    }
    
    struct CrafterProfile {
        euint32 crafterId;
        euint32 level;
        euint32 experience;
        euint32 totalCrafts;
        euint32 successfulCrafts;
        euint32 reputation;
        bool isActive;
        address wallet;
        string name;
        uint256 joinedAt;
    }
    
    mapping(uint256 => RuneRecipe) public recipes;
    mapping(uint256 => Ingredient) public ingredients;
    mapping(uint256 => CraftingSession) public craftingSessions;
    mapping(address => CrafterProfile) public crafterProfiles;
    mapping(address => euint32) public crafterReputation;
    mapping(uint256 => mapping(uint256 => euint32)) public recipeIngredients; // recipeId => ingredientId => quantity
    
    uint256 public recipeCounter;
    uint256 public ingredientCounter;
    uint256 public sessionCounter;
    uint256 public crafterCounter;
    
    address public owner;
    address public verifier;
    
    event RecipeCreated(uint256 indexed recipeId, address indexed creator, string name);
    event IngredientAdded(uint256 indexed ingredientId, string name);
    event CraftingSessionStarted(uint256 indexed sessionId, uint256 indexed recipeId, address indexed crafter);
    event CraftingSessionCompleted(uint256 indexed sessionId, bool success, uint32 manaSpent);
    event CrafterRegistered(address indexed crafter, string name);
    event RecipeVerified(uint256 indexed recipeId, bool isVerified);
    event ReputationUpdated(address indexed crafter, uint32 reputation);
    
    constructor(address _verifier) {
        owner = msg.sender;
        verifier = _verifier;
    }
    
    function createRecipe(
        string memory _name,
        string memory _description,
        string memory _category,
        uint256 _difficulty,
        uint256 _powerLevel,
        uint256 _manaCost,
        bool _isPublic
    ) public returns (uint256) {
        require(bytes(_name).length > 0, "Recipe name cannot be empty");
        require(_difficulty > 0 && _difficulty <= 10, "Difficulty must be between 1 and 10");
        require(_powerLevel > 0, "Power level must be positive");
        
        uint256 recipeId = recipeCounter++;
        
        recipes[recipeId] = RuneRecipe({
            recipeId: FHE.asEuint32(0), // Will be set properly later
            difficulty: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            powerLevel: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            manaCost: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            isPublic: _isPublic,
            isVerified: false,
            name: _name,
            description: _description,
            category: _category,
            creator: msg.sender,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });
        
        emit RecipeCreated(recipeId, msg.sender, _name);
        return recipeId;
    }
    
    function addIngredient(
        string memory _name,
        string memory _description,
        uint256 _rarity
    ) public returns (uint256) {
        require(bytes(_name).length > 0, "Ingredient name cannot be empty");
        require(_rarity > 0 && _rarity <= 5, "Rarity must be between 1 and 5");
        
        uint256 ingredientId = ingredientCounter++;
        
        ingredients[ingredientId] = Ingredient({
            ingredientId: FHE.asEuint32(0), // Will be set properly later
            quantity: FHE.asEuint32(0),
            rarity: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            name: _name,
            description: _description
        });
        
        emit IngredientAdded(ingredientId, _name);
        return ingredientId;
    }
    
    function addIngredientToRecipe(
        uint256 _recipeId,
        uint256 _ingredientId,
        externalEuint32 _quantity,
        bytes calldata inputProof
    ) public {
        require(recipes[_recipeId].creator == msg.sender, "Only recipe creator can add ingredients");
        require(ingredients[_ingredientId].ingredientId != FHE.asEuint32(0), "Ingredient does not exist");
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalQuantity = FHE.fromExternal(_quantity, inputProof);
        
        recipeIngredients[_recipeId][_ingredientId] = internalQuantity;
    }
    
    function startCraftingSession(
        uint256 _recipeId,
        externalEuint32 _manaAmount,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(recipes[_recipeId].creator != address(0), "Recipe does not exist");
        require(recipes[_recipeId].isPublic || recipes[_recipeId].creator == msg.sender, "Recipe is private");
        
        uint256 sessionId = sessionCounter++;
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalManaAmount = FHE.fromExternal(_manaAmount, inputProof);
        
        craftingSessions[sessionId] = CraftingSession({
            sessionId: FHE.asEuint32(0), // Will be set properly later
            recipeId: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            successRate: FHE.asEuint32(0), // Will be calculated based on crafter level and recipe difficulty
            manaSpent: internalManaAmount,
            isCompleted: false,
            crafter: msg.sender,
            startTime: block.timestamp,
            endTime: 0
        });
        
        emit CraftingSessionStarted(sessionId, _recipeId, msg.sender);
        return sessionId;
    }
    
    function completeCraftingSession(
        uint256 _sessionId,
        externalEuint32 _successRate,
        bytes calldata inputProof
    ) public {
        require(craftingSessions[_sessionId].crafter == msg.sender, "Only session crafter can complete");
        require(!craftingSessions[_sessionId].isCompleted, "Session already completed");
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalSuccessRate = FHE.fromExternal(_successRate, inputProof);
        
        craftingSessions[_sessionId].successRate = internalSuccessRate;
        craftingSessions[_sessionId].isCompleted = true;
        craftingSessions[_sessionId].endTime = block.timestamp;
        
        // Update crafter experience and reputation
        if (crafterProfiles[msg.sender].wallet != address(0)) {
            crafterProfiles[msg.sender].totalCrafts = FHE.add(crafterProfiles[msg.sender].totalCrafts, FHE.asEuint32(1));
            
            // Add experience based on success rate
            euint32 experienceGained = FHE.mul(internalSuccessRate, FHE.asEuint32(10));
            crafterProfiles[msg.sender].experience = FHE.add(crafterProfiles[msg.sender].experience, experienceGained);
        }
        
        emit CraftingSessionCompleted(_sessionId, true, 0); // Success will be decrypted off-chain
    }
    
    function registerCrafter(string memory _name) public {
        require(crafterProfiles[msg.sender].wallet == address(0), "Crafter already registered");
        require(bytes(_name).length > 0, "Name cannot be empty");
        
        uint256 crafterId = crafterCounter++;
        
        crafterProfiles[msg.sender] = CrafterProfile({
            crafterId: FHE.asEuint32(0), // Will be set properly later
            level: FHE.asEuint32(1),
            experience: FHE.asEuint32(0),
            totalCrafts: FHE.asEuint32(0),
            successfulCrafts: FHE.asEuint32(0),
            reputation: FHE.asEuint32(100), // Starting reputation
            isActive: true,
            wallet: msg.sender,
            name: _name,
            joinedAt: block.timestamp
        });
        
        emit CrafterRegistered(msg.sender, _name);
    }
    
    function verifyRecipe(uint256 _recipeId, bool _isVerified) public {
        require(msg.sender == verifier, "Only verifier can verify recipes");
        require(recipes[_recipeId].creator != address(0), "Recipe does not exist");
        
        recipes[_recipeId].isVerified = _isVerified;
        emit RecipeVerified(_recipeId, _isVerified);
    }
    
    function updateCrafterReputation(address _crafter, euint32 _reputation) public {
        require(msg.sender == verifier, "Only verifier can update reputation");
        require(_crafter != address(0), "Invalid crafter address");
        require(crafterProfiles[_crafter].wallet != address(0), "Crafter not registered");
        
        crafterReputation[_crafter] = _reputation;
        crafterProfiles[_crafter].reputation = _reputation;
        
        emit ReputationUpdated(_crafter, 0); // FHE.decrypt(_reputation) - will be decrypted off-chain
    }
    
    function getRecipeInfo(uint256 _recipeId) public view returns (
        string memory name,
        string memory description,
        string memory category,
        uint8 difficulty,
        uint8 powerLevel,
        uint8 manaCost,
        bool isPublic,
        bool isVerified,
        address creator,
        uint256 createdAt,
        uint256 updatedAt
    ) {
        RuneRecipe storage recipe = recipes[_recipeId];
        return (
            recipe.name,
            recipe.description,
            recipe.category,
            0, // FHE.decrypt(recipe.difficulty) - will be decrypted off-chain
            0, // FHE.decrypt(recipe.powerLevel) - will be decrypted off-chain
            0, // FHE.decrypt(recipe.manaCost) - will be decrypted off-chain
            recipe.isPublic,
            recipe.isVerified,
            recipe.creator,
            recipe.createdAt,
            recipe.updatedAt
        );
    }
    
    function getCrafterProfile(address _crafter) public view returns (
        string memory name,
        uint8 level,
        uint8 experience,
        uint8 totalCrafts,
        uint8 successfulCrafts,
        uint8 reputation,
        bool isActive,
        uint256 joinedAt
    ) {
        CrafterProfile storage profile = crafterProfiles[_crafter];
        return (
            profile.name,
            0, // FHE.decrypt(profile.level) - will be decrypted off-chain
            0, // FHE.decrypt(profile.experience) - will be decrypted off-chain
            0, // FHE.decrypt(profile.totalCrafts) - will be decrypted off-chain
            0, // FHE.decrypt(profile.successfulCrafts) - will be decrypted off-chain
            0, // FHE.decrypt(profile.reputation) - will be decrypted off-chain
            profile.isActive,
            profile.joinedAt
        );
    }
    
    function getCraftingSessionInfo(uint256 _sessionId) public view returns (
        uint8 recipeId,
        uint8 successRate,
        uint8 manaSpent,
        bool isCompleted,
        address crafter,
        uint256 startTime,
        uint256 endTime
    ) {
        CraftingSession storage session = craftingSessions[_sessionId];
        return (
            0, // FHE.decrypt(session.recipeId) - will be decrypted off-chain
            0, // FHE.decrypt(session.successRate) - will be decrypted off-chain
            0, // FHE.decrypt(session.manaSpent) - will be decrypted off-chain
            session.isCompleted,
            session.crafter,
            session.startTime,
            session.endTime
        );
    }
    
    function getIngredientInfo(uint256 _ingredientId) public view returns (
        string memory name,
        string memory description,
        uint8 rarity,
        uint8 quantity
    ) {
        Ingredient storage ingredient = ingredients[_ingredientId];
        return (
            ingredient.name,
            ingredient.description,
            0, // FHE.decrypt(ingredient.rarity) - will be decrypted off-chain
            0  // FHE.decrypt(ingredient.quantity) - will be decrypted off-chain
        );
    }
}
