import Vue from "vue";
import Vuetify from "vuetify";
import { mount } from "@vue/test-utils";
import DraggableTreeview from "../src/DraggableTreeview.vue";

describe("DraggableTreeview", () => {
  test("renders correctly", () => {
    const wrapper = mount(DraggableTreeview, {
      vuetify: new Vuetify({
        mocks: {
          $vuetify: {
            theme: {
              dark: false,
            },
          },
        },
      }),
      propsData: {
        value: [
          {
            id: 1,
            name: "test",
            children: [
              {
                id: 101,
                name: "test-children",
                children: [{ id: 201, name: "test-children-children" }],
              },
            ],
          },
        ],
      },
    });
    expect(wrapper.element).toMatchSnapshot();
    wrapper.find(".v-treeview-node__root").trigger("click");
    Vue.nextTick().then(() => {
      expect(wrapper.element).toMatchSnapshot();
    });
  });

  test("renders correctly with slot", () => {
    const wrapper = mount(DraggableTreeview, {
      vuetify: new Vuetify({
        mocks: {
          $vuetify: {
            theme: {
              dark: false,
            },
          },
        },
      }),
      scopedSlots: {
        label({ item }: any) {
          return this.$createElement(
            "span",
            {
              attrs: { class: "primary--text" },
            },
            [item.name]
          );
        },
      },
      propsData: {
        value: [
          {
            id: 1,
            name: "test",
            children: [
              {
                id: 101,
                name: "test-children",
                children: [{ id: 201, name: "test-children-children" }],
              },
            ],
          },
        ],
      },
    });
    expect(wrapper.element).toMatchSnapshot();
    wrapper.find(".v-treeview-node__root").trigger("click");
    Vue.nextTick().then(() => {
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
