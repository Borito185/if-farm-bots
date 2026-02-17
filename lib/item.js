const { control } = require("./control")

exports.item = {
    of(name) { return "minecraft:" + name; },

    select(item, slot, filter = null) {
        bot_state.on_repeat.set("select", () => {
            bot_state.INVENTORY.setSelectedHotbarSlotIndex(slot)
            const slots = this.find(item, filter);

            if (slots.includes(36+slot)) return;

            if (slots.length === 0) {
                throw new Error("Couldn't find " + item + " in inventory")
            }

            bot_state.INVENTORY.swapHotbar(slots[0], slot);
            Client.waitTick(4)
        })

        control.once()
    },

    selectTool(item, slot) {
        this.select(item, slot, i => i.getDurability() > 10 || i.getMaxDurability() < 10)
    },

    is_holding(item) {
        let idx = bot_state.INVENTORY.getSelectedHotbarSlotIndex()
        idx += 36
        let slot = bot_state.INVENTORY.getSlot(idx)
        return slot.getItemId() === item
    },

    find(item, fn = null) {
        const slots = []

        const count = bot_state.INVENTORY.getTotalSlots()

        for (let i = 0; i < count; i++) {
            let slot = bot_state.INVENTORY.getSlot(i)
            if (slot.getItemId() !== item) continue
            if (fn !== null && !fn(slot)) continue

            slots.push(i)
        }
        return slots
    },

    drop_all_of(item) {
        const indices = bot_state.INVENTORY.findItem(item);
        for (let i = 0; i < indices.length; i++) {
            let index = indices[i];
            bot_state.INVENTORY.dropSlot(index, true);
            Client.waitTick(3)
        }
    },

    drop_one_of(item) {
        const indices = bot_state.INVENTORY.findItem(item);
        for (let i = 0; i < indices.length; i++) {
            let index = indices[i];
            bot_state.INVENTORY.dropSlot(index, false);
            Client.waitTick(3)
            return
        }
    },

    craft(item) {
        control.safe(() => {
            const recipes = bot_state.INVENTORY.getCraftableRecipes();
            for (let i = 0; i < recipes.length; i++) {
                /** @type {RecipeHelper} */
                const recipe = recipes[i];
                if (recipe.getOutput().getItemId() !== item) continue

                if (!recipe.canCraft()) {
                    throw new Error("Not enough items to craft");
                }

                recipe.craft(false)
                Client.waitTick(3)
                bot_state.INVENTORY.quick(0)
                Client.waitTick(5)
                return;
            }
        })
    },

    count(item) {
        return bot_state.INVENTORY.getItemCount().get(item)
    }
}
