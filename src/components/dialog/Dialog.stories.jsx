import Dialog from './Dialog';

const meta = {
  component: Dialog,
  tags: ['autodocs'],
  argTypes: {
    onClose: { action: 'closed' }, // Logs close action in Storybook
    children: { control: 'text' },
  },
};

export default meta;

// Default children content for stories
const defaultContent = 'This is a sample dialog content';

export const DialogWithTitle = {
  args: {
    title: 'Success',
    children: defaultContent + ' with title.',
  },
};

export const DialogWithOutTitle = {
  args: {
    children: defaultContent + ' without title.',
  },
};

export const DialogWithLongContent = {
  args: {
    title: 'Information',
    children: (
      <div>
        {[...Array(10)].map((_, i) => (
          <p key={i}>This is paragraph {i + 1}</p>
        ))}
      </div>
    ),
  },
};

export const DialogWithCustomContent = {
  args: {
    title: 'Login Form',
    children: (
      <form>
        <label>
          Username:
          <input type="text" name="username" />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
    ),
  },
};

export const DialogWithNodeTitle = {
  args: {
    title: <span style={{ color: 'red' }}>⚠ Warning</span>,
    children: 'This is a warning dialog with a React node as title.',
  },
};
