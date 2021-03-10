import { enumDirection, Vector } from "../../core/vector";
import { enumPinSlotType, WiredPinsComponent } from "../components/wired_pins";
import { Entity } from "../entity";
import { MetaBuilding } from "../meta_building";
import { defaultBuildingVariant } from "../meta_building_variant";
import { GameRoot } from "../root";
import { LeverComponent } from "../components/lever";
import { enumHubGoalRewards } from "../tutorial_goals";

export class MetaLeverBuilding extends MetaBuilding {
    constructor() {
        super("lever");
    }

    /**
     * @param {string} variant
     */
    getSilhouetteColor(variant) {
        return MetaLeverBuilding.silhouetteColors[variant]();
    }

    /**
     * @param {string} variant
     */
    getDimensions(variant) {
        return MetaLeverBuilding.dimensions[variant]();
    }

    /**
     * @param {string} variant
     */
    getIsRemovable(variant) {
        return MetaLeverBuilding.isRemovable[variant]();
    }

    /**
     * @param {string} variant
     */
    getIsRotateable(variant) {
        return MetaLeverBuilding.isRotateable[variant]();
    }

    /**
     * @param {GameRoot} root
     */
    getAvailableVariants(root) {
        const variants = MetaLeverBuilding.avaibleVariants;

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
        return MetaLeverBuilding.layerByVariant[variant](root);
    }

    /**
     * @param {string} variant
     */
    getShowLayerPreview(variant) {
        return MetaLeverBuilding.layerPreview[variant]();
    }

    /**
     * @param {number} rotation
     * @param {number} rotationVariant
     * @param {string} variant
     * @param {Entity} entity
     * @returns {Array<number>|null}
     */
    getSpecialOverlayRenderMatrix(rotation, rotationVariant, variant, entity) {
        let matrices = MetaLeverBuilding.overlayMatrices[variant](entity, rotationVariant);
        return matrices ? matrices[rotation] : null;
    }

    getSprite() {
        return null;
    }

    /**
     * @param {string} variant
     */
    getRenderPins(variant) {
        return MetaLeverBuilding.renderPins[variant]();
    }

    /**
     * Creates the entity at the given location
     * @param {Entity} entity
     */
    setupEntityComponents(entity) {
        MetaLeverBuilding.setupEntityComponents.forEach(func => func(entity));
    }

    /**
     * @param {Entity} entity
     * @param {number} rotationVariant
     * @param {string} variant
     */
    updateVariants(entity, rotationVariant, variant) {
        MetaLeverBuilding.componentVariations[variant](entity, rotationVariant);
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
                    ],
                })
            ),
        entity => entity.addComponent(new LeverComponent({})),
    ];

    static overlayMatrices = {
        [defaultBuildingVariant]: (entity, rotationVariant) => null,
    };

    static dimensions = {
        [defaultBuildingVariant]: () => new Vector(1, 1),
    };

    static silhouetteColors = {
        [defaultBuildingVariant]: () => "#1a678b",
    };

    static isRemovable = {
        [defaultBuildingVariant]: () => true,
    };

    static isRotateable = {
        [defaultBuildingVariant]: () => true,
    };

    static avaibleVariants = {
        [defaultBuildingVariant]: root =>
            root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_wires_painter_and_levers),
    };

    static layerByVariant = {
        [defaultBuildingVariant]: root => "regular",
    };

    static layerPreview = {
        [defaultBuildingVariant]: () => "wires",
    };

    static renderPins = {
        [defaultBuildingVariant]: () => true,
    };

    static componentVariations = {
        [defaultBuildingVariant]: (entity, rotationVariant) => {
            entity.components.WiredPins.setSlots([
                {
                    pos: new Vector(0, 0),
                    direction: enumDirection.top,
                    type: enumPinSlotType.logicalEjector,
                },
            ]);
        },
    };
}
