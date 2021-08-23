<template>
  <div class="editor">
    <editor-menu-bubble
      class="menububble"
      :editor="editor"
      @hide="hideLinkMenu"
      v-slot="{ commands, isActive, getMarkAttrs, menu }"
    >
      <div
        class="menububble"
        :class="{ 'is-active': menu.isActive }"
        :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`"
      >
        <form
          class="menububble__form"
          v-if="linkMenuIsActive"
          @submit.prevent="setLinkUrl(commands.link, linkUrl)"
        >
          <input
            class="menububble__input"
            type="text"
            v-model="linkUrl"
            placeholder="https://"
            ref="linkInput"
            @keydown.esc="hideLinkMenu"
          />

          <button
            class="menububble__button"
            type="button"
            @click="setLinkUrl(commands.link, null)"
          >
            <v-icon small>mdi-close</v-icon>
          </button>
        </form>

        <template v-else>
          <button
            class="menububble__button"
            @click="showLinkMenu(getMarkAttrs('link'))"
            type="button"
          >
            <span>{{ isActive.link() ? "Update Link" : "Add Link" }}</span>
            <v-icon small>mdi-link</v-icon>
          </button>
          <button
            class="menububble__button"
            :class="{ 'is-active': isActive.italic() }"
            @click="commands.italic"
            type="button"
          >
            <v-icon small>mdi-format-italic</v-icon>
          </button>
          <button
            class="menububble__button"
            :class="{ 'is-active': isActive.bold() }"
            @click="commands.bold"
            type="button"
          >
            <v-icon small>mdi-format-bold</v-icon>
          </button>
        </template>
      </div>
    </editor-menu-bubble>
    <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
      <div class="menubar">
        <v-btn
          text
          small
          class="menubar__button"
          @click="commands.undo"
          color="grey darken-3"
        >
          <v-icon small>mdi-undo</v-icon>
        </v-btn>

        <v-btn
          text
          small
          class="menubar__button"
          @click="commands.redo"
          color="grey darken-3"
        >
          <v-icon small>mdi-redo</v-icon>
        </v-btn>

        <v-btn
          small
          text
          class="menubar__button"
          :class="{ 'is-active': isActive.bold() }"
          @click="commands.bold"
          color="grey darken-3"
        >
          <v-icon small>mdi-format-bold</v-icon>
        </v-btn>

        <v-btn
          text
          small
          class="menubar__button"
          :class="{ 'is-active': isActive.italic() }"
          @click="commands.italic"
          color="grey darken-3"
        >
          <v-icon small>mdi-format-italic</v-icon>
        </v-btn>

        <v-btn
          text
          small
          class="menubar__button"
          :class="{ 'is-active': isActive.strike() }"
          @click="commands.strike"
          color="grey darken-3"
        >
          <v-icon small>mdi-format-strikethrough</v-icon>
        </v-btn>

        <v-btn
          text
          small
          class="menubar__button"
          :class="{ 'is-active': isActive.underline() }"
          @click="commands.underline"
          color="grey darken-3"
        >
          <v-icon small>mdi-format-underline</v-icon>
        </v-btn>

        <v-btn
          text
          small
          class="menubar__button"
          :class="{ 'is-active': isActive.code() }"
          @click="commands.code"
          color="grey darken-3"
        >
          <v-icon small>mdi-code-tags</v-icon>
        </v-btn>

        <v-btn
          text
          small
          class="menubar__button"
          :class="{ 'is-active': isActive.paragraph({ textAlign: 'left' }) }"
          @click="commands.paragraph({ textAlign: 'left' })"
          color="grey darken-3"
        >
          <v-icon small>mdi-format-align-left</v-icon>
        </v-btn>
        <v-btn
          text
          small
          class="menubar__button"
          :class="{ 'is-active': isActive.paragraph({ textAlign: 'center' }) }"
          @click="commands.paragraph({ textAlign: 'center' })"
          color="grey darken-3"
        >
          <v-icon small>mdi-format-align-center</v-icon>
        </v-btn>
        <v-btn
          text
          small
          class="menubar__button"
          :class="{ 'is-active': isActive.paragraph({ textAlign: 'right' }) }"
          @click="commands.paragraph({ textAlign: 'right' })"
          color="grey darken-3"
        >
          <v-icon small>mdi-format-align-right</v-icon>
        </v-btn>

        <v-btn
          text
          small
          class="menubar__button"
          :class="{ 'is-active': isActive.paragraph() }"
          @click="commands.paragraph"
          color="grey darken-3"
        >
          <v-icon small>mdi-format-paragraph</v-icon>
        </v-btn>

        <v-btn
          text
          small
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 1 }) }"
          @click="commands.heading({ level: 1 })"
          color="grey darken-3"
        >
          H1
        </v-btn>
        <v-btn
          text
          small
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 2 }) }"
          @click="commands.heading({ level: 2 })"
          color="grey darken-3"
        >
          H2
        </v-btn>
        <v-btn
          text
          small
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 3 }) }"
          @click="commands.heading({ level: 3 })"
          color="grey darken-3"
        >
          H3
        </v-btn>
        <v-btn
          text
          small
          class="menubar__button"
          :class="{ 'is-active': isActive.bullet_list() }"
          @click="commands.bullet_list()"
          color="grey darken-3"
        >
          <v-icon small>mdi-format-list-bulleted</v-icon>
        </v-btn>

        <v-btn
          text
          small
          class="menubar__button"
          :class="{ 'is-active': isActive.ordered_list() }"
          @click="commands.ordered_list()"
          color="grey darken-3"
        >
          <v-icon small>mdi-format-list-numbered</v-icon>
        </v-btn>

        <v-btn
          text
          small
          class="menubar__button"
          :class="{ 'is-active': isActive.blockquote() }"
          @click="commands.blockquote()"
          color="grey darken-3"
        >
          <v-icon small>mdi-format-quote-open</v-icon>
        </v-btn>

        <button
          class="menubar__button"
          @click="showImagePrompt(commands.image)"
        >
          <v-icon small>mdi-image</v-icon>
        </button>

        <!-- <v-btn
          text
          small
          class="menubar__button"
          @click="showEmbedPrompt(commands.iframe)"
          color="grey darken-3"
        >
          <v-icon small>mdi-iframe</v-icon>
        </v-btn> -->

        <v-btn
          text
          small
          class="menubar__button"
          :class="{ 'is-active': isActive.horizontal_rule() }"
          @click="commands.horizontal_rule()"
          color="grey darken-3"
        >
          <v-icon small>mdi-minus</v-icon>
        </v-btn>

        <v-btn
          text
          small
          class="menubar__button"
          @click="
            commands.createTable({
              rowsCount: 3,
              colsCount: 3,
              withHeaderRow: false,
            })
          "
          color="grey darken-3"
        >
          <v-icon small>mdi-table-large</v-icon>
        </v-btn>
        <span v-if="isActive.table()">
          <v-btn
            text
            small
            class="menubar__button"
            @click="commands.deleteTable"
            color="grey darken-3"
          >
            <v-icon small>mdi-table-large-remove</v-icon>
          </v-btn>
          <v-btn
            text
            small
            class="menubar__button"
            @click="commands.addColumnBefore"
            color="grey darken-3"
          >
            <v-icon small>mdi-table-column-plus-before</v-icon>
          </v-btn>
          <v-btn
            text
            small
            class="menubar__button"
            @click="commands.addColumnAfter"
            color="grey darken-3"
          >
            <v-icon small>mdi-table-column-plus-after</v-icon>
          </v-btn>
          <v-btn
            text
            small
            class="menubar__button"
            @click="commands.deleteColumn"
            color="grey darken-3"
          >
            <v-icon small>mdi-table-column-remove</v-icon>
          </v-btn>
          <v-btn
            text
            small
            class="menubar__button"
            @click="commands.addRowBefore"
            color="grey darken-3"
          >
            <v-icon small>mdi-table-row-plus-before</v-icon>
          </v-btn>
          <v-btn
            text
            small
            class="menubar__button"
            @click="commands.addRowAfter"
            color="grey darken-3"
          >
            <v-icon small>mdi-table-row-plus-after</v-icon>
          </v-btn>
          <v-btn
            text
            small
            class="menubar__button"
            @click="commands.deleteRow"
            color="grey darken-3"
          >
            <v-icon small>mdi-table-row-remove</v-icon>
          </v-btn>
          <v-btn
            text
            small
            class="menubar__button"
            @click="commands.toggleCellMerge"
            color="grey darken-3"
          >
            <v-icon small>mdi-table-merge-cells</v-icon>
          </v-btn>
        </span>
      </div>
    </editor-menu-bar>

    <editor-content class="editor__content" :editor="editor" />
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar, EditorMenuBubble } from "tiptap";
import Paragraph from "./Paragraph.js";
import Iframe from "./Iframe.js";

import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  Image,
  Placeholder,
} from "tiptap-extensions";
export default {
  components: {
    EditorContent,
    EditorMenuBar,
    EditorMenuBubble,
    // Icon,
  },
  props: {
    value: String,
    placeholder: {
      type: String,
      default: "Write Something...",
    },
  },
  data() {
    return {
      editor: new Editor({
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History(),
          new Paragraph(),
          new Table({
            resizable: true,
          }),
          new TableHeader(),
          new TableCell(),
          new TableRow(),
          new Iframe(),
          new Image(),
          new Placeholder({
            emptyEditorClass: "is-editor-empty",
            emptyNodeClass: "is-empty",
            showOnlyCurrent: true,
            emptyNodeText: this.placeholder,
            showOnlyWhenEditable: true,
          }),
        ],
        content: this.value,
        onUpdate: ({ getHTML }) => {
          // get new content on update
          const newContent = getHTML();
          // console.log(newContent);
          this.$emit("input", newContent);
        },
      }),
      linkUrl: null,
      linkMenuIsActive: false,
    };
  },
  methods: {
    // newYourEditor() {
    //   console.log("fire");
    // },
    showImagePrompt(command) {
      const src = prompt("Enter the url of your image here");
      if (src !== null) {
        command({ src });
      }
    },
    showEmbedPrompt(command) {
      const src = prompt("Enter the url of your embed here");
      if (src !== null) {
        command({ src });
      }
    },
    showLinkMenu(attrs) {
      this.linkUrl = attrs.href;
      this.linkMenuIsActive = true;
      this.$nextTick(() => {
        this.$refs.linkInput.focus();
      });
    },
    hideLinkMenu() {
      this.linkUrl = null;
      this.linkMenuIsActive = false;
    },
    setLinkUrl(command, url) {
      command({ href: url });
      this.hideLinkMenu();
    },
  },
  beforeDestroy() {
    this.editor.destroy();
  },
};
</script>

<style lang="scss">
.editor {
  padding: 10px;
  border: 1px solid #999;
  border-radius: 5px;
  min-height: 250px;

  p.is-editor-empty:first-child::before {
    content: attr(data-empty-text);
    float: left;
    color: #aaa;
    pointer-events: none;
    height: 0;
    font-style: italic;
    font-size: 16px;
  }
}
.editor__content > div,
.ProseMirror {
  outline: none !important;
  min-height: 200px;
}
.editor .menubar {
  margin-bottom: 10px;
}
.menubar__button {
  margin-right: 2px;
  padding: 0 5px !important;
  min-width: 30px !important;
}
.menubar__button.is-active::before {
  opacity: 0.04 !important;
}

.editor__content {
  pre {
    padding: 0.7rem 1rem;
    border-radius: 5px;
    background: #000;
    color: #fff;
    font-size: 0.8rem;
    overflow-x: auto;
  }
  img {
    max-width: 100%;
  }
  p {
    code {
      padding: 0.2rem 0.4rem;
      border-radius: 5px;
      font-size: 0.8rem;
      font-weight: 700;
      background: rgba(0, 0, 0, 0.1);
      color: rgba(0, 0, 0, 0.8);
    }
  }
  code {
    background-color: transparent;
  }
  table {
    td,
    th {
      border: 1px solid #e5e5e5;
      padding: 8px;
    }
    .selectedCell,
    .selectedCell:after {
      background-color: rgba(200, 200, 255, 0.4);
    }

    th {
      font-weight: bold;
    }
  }
}
.menububble {
  position: absolute;
  display: flex;
  z-index: 20;
  background: #000;
  border-radius: 5px;
  padding: 0.3rem;
  margin-bottom: 0.5rem;
  transform: translateX(-50%);
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s, visibility 0.2s;

  &.is-active {
    opacity: 1;
    visibility: visible;
  }

  &__button {
    display: inline-flex;
    background: transparent;
    border: 0;
    color: #fff;
    padding: 0.2rem 0.5rem;
    margin-right: 0.2rem;
    border-radius: 3px;
    cursor: pointer;

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      background-color: rgba(#fff, 0.1);
    }

    &.is-active {
      background-color: rgba(#fff, 0.2);
    }
  }

  &__form {
    display: flex;
    align-items: center;
  }

  &__input {
    font: inherit;
    border: none;
    background: transparent;
    color: #fff;
    outline: none;
  }

  .v-icon {
    color: #fff;
  }
}
</style>
