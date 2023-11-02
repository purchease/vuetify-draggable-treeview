<template>
  <div
    :class="`v-treeview-node v-treeview-node--click ${
      hasChildren ? '' : 'v-treeview-node--leaf'
    }`"
  >
    <div
      class="v-treeview-node__root"
      :class="{
        'v-treeview-node--active': isActive,
        'primary--text': isActive,
      }"
      @click="toggle"
    >
      <div
        v-for="index in appendLevel"
        :key="index"
        class="v-treeview-node__level"
      />
      <i
        v-if="hasChildren"
        role="button"
        class="v-icon notranslate v-treeview-node__toggle v-icon--link mdi"
        :class="[
          {
            'v-treeview-node__toggle--open': isOpen,
            'theme--dark': isDark,
            'theme--light': !isDark,
          },
          expandIcon,
        ]"
      />
      <slot name="prepend" v-bind="{ item: value, open: isOpen }" />
      <div class="v-treeview-node__label">
        <slot name="label" v-bind="{ item: value, open: isOpen }">
          {{ value.name }}
        </slot>
      </div>
      <slot name="append" v-bind="{ item: value }" />
    </div>
    <div
      v-if="isOpen"
      class="v-treeview-node__children v-treeview-node__children__draggable"
    >
      <draggable
        :group="group"
        :value="value.children"
        ghost-class="ghost"
        @change="updateValue"
      >
        <treeview-node
          v-for="child in value.children"
          :key="child.id"
          :level="level + 1"
          :group="group"
          :value="child"
          :expand-icon="expandIcon"
          :open-node-ids="openNodeIds"
          :selected-node-ids="selectedNodeIds"
          @input="updateChildValue"
          @toggle="$emit('toggle', $event)"
        >
          <template #prepend="{ item, open }">
            <slot name="prepend" v-bind="{ item, open }" />
          </template>
          <template #label="{ item, open }">
            <slot name="label" v-bind="{ item, open }"></slot>
          </template>
          <template #append="{ item }">
            <slot name="append" v-bind="{ item }" />
          </template>
        </treeview-node>
      </draggable>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import Draggable from "vuedraggable";

import { PropValidator } from "vue/types/options";
type NodeArray = (string | number)[];

type TreeItem = {
  id: number;
  name: string;
  children: TreeItem[];
};

export default Vue.extend({
  name: "TreeviewNode",
  components: {
    Draggable,
  },
  props: {
    level: {
      type: Number,
      default: 0,
    },
    value: {
      type: Object as PropType<TreeItem>,
      default: (): TreeItem => ({
        id: 0,
        name: "",
        children: [],
      }),
    },
    root: {
      type: Boolean,
      default: (): boolean => false,
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
      isOpen: this.openNodeIds.includes(this.value.id),
      isActive: this.selectedNodeIds.includes(this.value.id),
      // localValue: { ...this.value } as TreeItem,
      localValue: {
        ...this.value,
        children: [...this.value.children],
      } as TreeItem,
    };
  },
  computed: {
    hasChildren(): boolean {
      return this.value.children != null && this.value.children.length > 0;
    },
    isDark(): boolean {
      return this.$vuetify.theme.dark;
    },
    appendLevel(): number {
      return this.level + (this.hasChildren ? 0 : 1);
    },
  },
  watch: {
    value(value): void {
      // this.localValue = { ...value };
      this.localValue = {
        ...value,
        children: [...this.value.children],
      };
    },
    openNodeIds(value): void {
      this.isOpen = value.includes(this.localValue.id);
    },
    selectedNodeIds(value): void {
      this.isActive = value.includes(this.localValue.id);
    },
  },
  methods: {
    updateValue($event: any): void {
      // removing must be done before adding
      // in order for the event `moved` to work properly
      const dataForRemoving = $event.removed || $event.moved;
      if (dataForRemoving) {
        this.localValue.children.splice(dataForRemoving.oldIndex, 1);
      }

      const dataForAdding = $event.added || $event.moved;
      if (dataForAdding) {
        this.localValue.children.splice(
          dataForAdding.newIndex,
          0,
          dataForAdding.element
        );
      }

      this.$emit("input", this.localValue);
    },
    updateChildValue(value: TreeItem): void {
      const index = this.localValue.children.findIndex(
        (c) => c.id === value.id
      );
      this.$set(this.localValue.children, index, value);
      this.$emit("input", this.localValue);
    },
    toggle(): void {
      this.isOpen = !this.isOpen;
      this.$emit("toggle", this.localValue.id);
    },
  },
});
</script>
