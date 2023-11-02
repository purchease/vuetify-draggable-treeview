<template>
  <draggable
    :value="localValue"
    :group="group"
    class="v-treeview v-treeview-draggable"
    :class="themeClassName"
    ghost-class="ghost"
    @input="updateValue"
  >
    <draggable-tree-view-node
      v-for="node in value"
      :key="node.id"
      :group="group"
      :value="node"
      :expand-icon="expandIcon"
      :open-node-ids="openNodeIds"
      :selected-node-ids="selectedNodeIds"
      @input="updateItem"
      @toggle="updateSelectedNodeIds"
    >
      <template #prepend="{ item, open }">
        <slot name="prepend" v-bind="{ item, open }"> </slot>
      </template>
      <template #label="{ item, open }">
        <slot name="label" v-bind="{ item, open }"> </slot>
      </template>
      <template #append="{ item, open }">
        <slot name="append" v-bind="{ item, open }"> </slot>
      </template>
    </draggable-tree-view-node>
  </draggable>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import draggable from "vuedraggable";
import DraggableTreeViewNode from "./DraggableTreeviewNode.vue";

import { PropValidator } from "vue/types/options";
type NodeArray = (string | number)[];

export default Vue.extend({
  components: {
    draggable,
    DraggableTreeViewNode,
  },
  props: {
    value: {
      type: Array as PropType<{ id: string | number }[]>,
      default: (): { id: string | number }[] => {
        return [];
      },
    },
    group: {
      type: String,
      default: null,
    },
    expandIcon: {
      type: String,
      default: "mdi-menu-down",
    },
    openNodeIds: {
      type: Array,
      default: () => [],
    } as PropValidator<NodeArray>,
    selectedNodeIds: {
      type: Array,
      default: () => [],
    } as PropValidator<NodeArray>,
  },
  data() {
    return {
      localValue: [...this.value],
      multiple: false,
    };
  },
  computed: {
    themeClassName(): string {
      return this.$vuetify.theme.dark ? "theme--dark" : "theme--light";
    },
  },
  watch: {
    value(value): void {
      this.localValue = [...value];
    },
  },
  methods: {
    updateValue(value: any): void {
      this.localValue = value;
      this.$emit("input", this.localValue);
    },
    updateItem(itemValue: any): void {
      const index = this.localValue.findIndex((v) => v.id === itemValue.id);
      this.$set(this.localValue, index, itemValue);
      this.$emit("input", this.localValue);
    },
    updateSelectedNodeIds(nodeId: string | number): void {
      const index = this.selectedNodeIds.findIndex((id) => id === nodeId);
      if (index === -1) {
        this.$emit(
          "update:selected-node-ids",
          this.multiple ? this.selectedNodeIds.concat([nodeId]) : [nodeId]
        );
      } else {
        this.$emit(
          "update:selected-node-ids",
          this.selectedNodeIds.concat().splice(index, 1)
        );
      }
    },
  },
});
</script>
