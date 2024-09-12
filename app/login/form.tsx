

export default function LoginForm(

) {
  return (      <h2 className="text-2xl font-bold mb-4 text-center text-foreground">
    Login
  </h2>
  {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
  <form
    onSubmit={handleSubmit}
    className="bg-card dark:bg-gray-800 p-6 rounded-lg shadow-md"
  >
    <div className="mb-4">
      <div className="relative">
        <input
          id="email"
          type="email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full p-2 bg-input-background dark:bg-gray-700 text-foreground dark:text-gray-200 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-primary dark:focus:border-primary transition-colors placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>
      <div className="relative mt-4">
        <input
          id="password"
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full p-2 bg-input-background dark:bg-gray-700 text-foreground dark:text-gray-200 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-primary dark:focus:border-primary transition-colors placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>
    </div>
    <button
      type="submit"
      className="w-full bg-primary text-primary-foreground p-2 rounded hover:bg-primary/90 transition-colors"
    >
      Login
    </button>
  </form>);
}