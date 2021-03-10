import { generateMatrixRotations } from "../../core/utils";
import { enumDirection, Vector } from "../../core/vector";
import { enumLogicGateType, LogicGateComponent } from "../components/logic_gate";
import { enumPinSlotType, WiredPinsComponent } from "../components/wired_pins";
import { Entity } from "../entity";
import { MetaBuilding } from "../meta_building";
import { defaultBuildingVariant } from "../meta_building_variant";
import { GameRoot } from "../root";
import { enumHubGoalRewards } from "../tutorial_goals";

export class MetaTransistorBuilding extends MetaBuilding {
    constructor() {
        super("transistor");
    }

    /**
     * @param {string} variant
     */
    getSilhouetteColor(variant) {
        return MetaTransistorBuilding.silhouetteColors[variant]();
    }

    /**
     * @param {string} variant
     */
    getIsRemovable(variant) {
        return MetaTransistorBuilding.isRemovable[variant]();
    }

    /**
     * @param {string} variant
     */
    getIsRotateable(variant) {
        return MetaTransistorBuilding.isRotateable[variant]();
    }

    /**
     * @param {GameRoot} root
     */
    getAvailableVariants(root) {
        const variants = MetaTransistorBuilding.avaibleVariants;

        let available = [];
        for (const variant in variants) {
            if (variants[variant](root)) available.push(variant);
        }

        return available;
    }

    /**
     * Returns the edit layer of the building
     * @param {GameRoot} root
     * @param {string} variant
     * @returns {Layer}
     */
    getLayer(root, variant) {
        // @ts-ignore
        return MetaTransistorBuilding.layerByVariant[variant](root);
    }

    /**
     * @param {string} variant
     */
    getDimensions(variant) {
        return MetaTransistorBuilding.dimensions[variant]();
    }

    /**
     * @param {string} variant
     */
    getShowLayerPreview(variant) {
        return MetaTransistorBuilding.layerPreview[variant]();
    }

    /**
     * @param {number} rotation
     * @param {number} rotationVariant
     * @param {string} variant
     * @param {Entity} entity
     * @returns {Array<number>|null}
     */
    getSpecialOverlayRenderMatrix(rotation, rotationVariant, variant, entity) {
        let matrices = MetaTransistorBuilding.overlayMatrices[variant](entity, rotationVariant);
        return matrices ? matrices[rotation] : null;
    }

    /**
     * @param {string} variant
     */
    getRenderPins(variant) {
        return MetaTransistorBuilding.renderPins[variant]();
    }

    /**
     * Creates the entity at the given location
     * @param {Entity} entity
     */
    setupEntityComponents(entity) {
        MetaTransistorBuilding.setupEntityComponents.forEach(func => func(entity));
    }

    /**
     * @param {Entity} entity
     * @param {number} rotationVariant
     * @param {string} variant
     */
    updateVariants(entity, rotationVariant, variant) {
        MetaTransistorBuilding.componentVariations[variant](entity, rotationVariant);
    }

    static setupEntityComponents = [
        entity =>
            entity.addComponent(
                new WiredPinsComponent({
                    slots: [
                        {
                            pos: new Vector(0, 0),
                            direction: enumDirection.top,
                            type: enumPinSlotType.logicalEjector,
                        },
                        {
                            pos: new Vector(0, 0),
                            direction: enumDirection.left,
                            type: enumPinSlotType.logicalAcceptor,
                        },
                        {
                            pos: new Vector(0, 0),
                            direction: enumDirection.bottom,
                            type: enumPinSlotType.logicalAcceptor,
                        },
                    ],
                })
            ),
        entity =>
            entity.addComponent(
                new LogicGateComponent({
                    type: enumLogicGateType.transistor,
                })
            ),
    ];

    static variants = {
        mirrored: "mirrored",
    };

    static overlayMatrices = {
        [defaultBuildingVariant]: (entity, rotationVariant) =>
            generateMatrixRotations([0, 1, 0, 1, 1, 0, 0, 1, 0]),
        [MetaTransistorBuilding.variants.mirrored]: (entity, rotationVariant) =>
            generateMatrixRotations([0, 1, 0, 0, 1, 1, 0, 1, 0]),
    };

    static dimensions = {
        [defaultBuildingVariant]: () => new Vector(1, 1),
        [MetaTransistorBuilding.variants.mirrored]: () => new Vector(1, 1),
    };

    static silhouetteColors = {
        [defaultBuildingVariant]: () => "#823cab",
        [MetaTransistorBuilding.variants.mirrored]: () => "#823cab",
    };

    static isRemovable = {
        [defaultBuildingVariant]: () => true,
        [MetaTransistorBuilding.variants.mirrored]: () => true,
    };

    static isRotateable = {
        [defaultBuildingVariant]: () => true,
        [MetaTransistorBuilding.variants.mirrored]: () => true,
    };

    static renderPins = {
        [defaultBuildingVariant]: () => false,
        [MetaTransistorBuilding.variants.mirrored]: () => false,
    };

    static layerPreview = {
        [defaultBuildingVariant]: () => "wires",
        [MetaTransistorBuilding.variants.mirrored]: () => "wires",
    };

    static avaibleVariants = {
        [defaultBuildingVariant]: root =>
            root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_logic_gates),
        [MetaTransistorBuilding.variants.mirrored]: root =>
            root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_logic_gates),
    };

    static layerByVariant = {
        [defaultBuildingVariant]: root => "wires",
        [MetaTransistorBuilding.variants.mirrored]: root => "wires",
    };

    static componentVariations = {
        [defaultBuildingVariant]: (entity, rotationVariant) => {
            entity.components.WiredPins.slots[1].direction = enumDirection.left;
        },

        [MetaTransistorBuilding.variants.mirrored]: (entity, rotationVariant) => {
            entity.components.WiredPins.slots[1].direction = enumDirection.right;
        },
    };
}
