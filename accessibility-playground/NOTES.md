# Accessibility Notes — My Components vs shadcn/ui

For this assignment, I first built three components myself in React + TypeScript: a Modal, Tabs, and Disclosure. After that, I installed shadcn/ui and added its Dialog and Tabs components.

I read my own code in `playground/`, the shadcn files in `src/components/ui/`, and also looked at the Base UI code used by shadcn.

These notes are about what I noticed when comparing both implementations and what I learned from it.

## Components I Compared

| Component | My Version                   | shadcn/ui Version              |
| --------- | ---------------------------- | ------------------------------ |
| Modal     | `playground/ModalDialog.tsx` | `src/components/ui/dialog.tsx` |
| Tabs      | `playground/Tabs.tsx`        | `src/components/ui/tabs.tsx`   |

---

## Gaps I Found

### Gap 1 — Handling the background when the modal is open

In my Modal, I used `aria-modal="true"` and also used the `inert` attribute on the elements outside the modal. I also locked the page scroll while the modal was open.

When I looked at shadcn's Dialog, I noticed that it does not depend only on `aria-modal`. The Base UI primitive handles the background using things like `aria-hidden`, focus trapping, pointer blocking, and scroll locking.

This showed me that `aria-modal` by itself is not enough. A modal should make the background actually unreachable to keyboard users and assistive technology, not just tell them that it is a modal.

My implementation was already doing some of this with `inert`, but I learned that libraries handle these cases in a much more complete way.

---

### Gap 2 — My Modal does not support `aria-describedby`

My Modal has an accessible title using `aria-labelledby`, but I did not add support for `aria-describedby`.

In shadcn/ui, there is a `DialogDescription` component. It creates the relationship between the dialog and its description automatically.

For example, if a dialog has:

* Title: "Delete account"
* Description: "This action cannot be undone."

A screen reader can understand both the name of the dialog and the extra information.

I learned that `aria-labelledby` and `aria-describedby` have different purposes. The first gives the dialog its name, while the second provides additional information.

---

### Gap 3 — My trigger has less accessibility information

My Modal trigger is just a normal button with a text label.

shadcn's `DialogTrigger` provides additional information such as `aria-haspopup`, `aria-expanded`, and `aria-controls`.

This gives assistive technology more information about what the button does and whether the dialog is currently open.

I learned that using a normal button is already a good start because the browser gives it keyboard support automatically, but a reusable component can provide additional state and relationship information.

---

### Gap 4 — My Tabs require a label, while shadcn does not provide one automatically

In my Tabs component, I added a required `label` prop and use it as the `aria-label` for the tablist.

This means the person using my component has to provide a name for the group of tabs.

In the shadcn Tabs implementation I looked at, the generated `TabsList` does not automatically provide a label. The developer needs to provide an accessible name when one is needed.

This was interesting because it showed me that a component can have the correct ARIA role but still not have a useful accessible name.

I learned that accessibility is not only about adding roles. The component also needs enough information for a screen reader user to understand what the widget is for.

---

### Gap 5 — My Tabs use automatic activation

In my Tabs component, pressing ArrowRight moves to the next tab and also changes the displayed panel immediately.

This is called automatic activation.

The shadcn/Base UI Tabs implementation supports manual activation by default. The user can move between tabs with the arrow keys and activate the selected tab separately. It also provides an option such as `activateOnFocus` for automatic activation.

The important thing I learned is that both approaches can be valid.

Automatic activation can feel faster, while manual activation can be better when the tab panels contain more complicated or larger content.

My implementation currently chooses automatic activation and does not provide that choice.

---

### Gap 6 — My focus trap has an edge case

My Modal focus trap works when there are focusable elements inside the dialog.

However, if there were no focusable elements, my `getFocusableElements` function would return an empty array and my focus trap would stop early. This means focus could potentially escape the modal.

My demo does have a close button, so I did not notice this while testing it.

When I looked at shadcn/Base UI, I found that it handles this situation with focus guards and additional focus-management logic.

This taught me that accessibility is not only about making the normal case work. Edge cases are also important, especially for reusable components.

---

## What I Learned About ARIA

One of the main things I learned is that ARIA roles are not enough by themselves.

For example:

* `role="dialog"` tells assistive technology that something is a dialog.
* `role="tablist"` tells it that the element contains tabs.
* `role="tab"` identifies individual tabs.
* `role="tabpanel"` identifies the content belonging to a tab.

But these roles also need the correct states and relationships.

For example, `aria-selected` needs to match the currently selected tab, and `aria-controls` needs to point to the correct panel.

I also learned the difference between naming and describing.

`aria-label` and `aria-labelledby` are used to give something a name, while `aria-describedby` provides additional information.

Another thing I learned is that IDs are very important in accessible components. Attributes such as `aria-controls`, `aria-labelledby`, and `aria-describedby` depend on the IDs matching the correct elements.

---

## What I Learned About Keyboard Accessibility

I learned that using native HTML elements is very helpful.

For example, using a real `<button>` gives me keyboard support for Enter and Space without having to manually write keyboard handlers.

For Tabs, I learned about the **roving tabindex** pattern.

Only the active tab should normally be reachable with the regular Tab key. The other tabs use `tabindex="-1"` and can be reached using the arrow keys.

I also learned that different widgets need different keyboard behavior.

For example:

* Tabs use ArrowLeft and ArrowRight.
* Home moves to the first tab.
* End moves to the last tab.
* A Modal needs to keep Tab and Shift+Tab inside the dialog.
* Escape closes the Modal.
* Disclosure uses a normal button, so Enter and Space work naturally.

This helped me understand that we should not just add keyboard handlers randomly. The expected keyboard behavior depends on the ARIA pattern.

---

## What I Learned About Focus Management

The Modal was the component where I learned the most about focus.

A modal has three important focus stages:

1. Move focus into the modal when it opens.
2. Keep focus inside while it is open.
3. Return focus to the original trigger when it closes.

My implementation does these things, but I found that shadcn/Base UI handles many more edge cases.

For example, it considers situations where:

* There are no focusable elements.
* Elements are added or removed while the dialog is open.
* The original trigger is no longer available.
* Dialogs are nested.
* Focus needs to be restored after animations or React rendering.

I also noticed that my focus restoration is more direct because I simply call `.focus()` on the trigger.

The shadcn implementation has more checks before restoring focus.

This showed me that focus management becomes much more complicated when a component needs to work reliably in many different situations.

---

## What I Learned From Reading shadcn/ui

One thing that surprised me was that the shadcn component files themselves are not doing all the accessibility work.

The shadcn components are mostly wrappers around headless primitives. A lot of the keyboard, ARIA, and focus-management behavior comes from the underlying Base UI components.

This helped me understand the difference between:

* **UI/styling**
* **Component structure**
* **Accessibility behavior**

I also noticed things such as `data-slot`, `cn()`, and styling variants being used to keep the components reusable and easier to customize.

The biggest lesson for me was that a component can look simple from the outside but have a lot of accessibility logic happening underneath.

---

## What I Would Improve in My Components

After doing this comparison, there are several things I would improve in my own components.

For the Modal, I would improve:

* Support for `aria-describedby`
* Handling the case where there are no focusable elements
* More robust focus restoration
* Better handling of changing content
* Better handling of nested dialogs
* More complete trigger accessibility

For Tabs, I would improve:

* Support for both automatic and manual activation
* Better handling of disabled tabs
* More robust keyboard navigation
* Better handling of different orientations
* More reusable accessibility configuration

I would not simply copy shadcn's code. The main purpose of this assignment was to understand why these accessibility behaviors are needed.

---

## Final Takeaway

Building these components myself helped me understand the basics of accessible React components much better.

Before this assignment, I mainly thought accessibility meant adding ARIA attributes. After working through the Modal, Tabs, and Disclosure, I understand that accessibility also includes:

* Keyboard interaction
* Focus management
* Correct ARIA states
* Correct relationships between elements
* Handling edge cases
* Using native HTML elements where possible

Reading shadcn/ui also showed me how much extra work is required to make a reusable component reliable.

The biggest thing I learned is that **making a component work is not the same as making it accessible and robust**. Building the components myself first made it much easier to understand what libraries like shadcn are handling for me.
