const ITEMS = [
  {
    icon: "✦",
    title: "Curated Selection",
    text: "Beauty essentials from brands we love",
  },
  {
    icon: "♡",
    title: "Save Your Favorites",
    text: "Build a wishlist and come back anytime",
  },
  {
    icon: "◈",
    title: "Track Your Orders",
    text: "See every order's status in your account",
  },
];

const ValueStrip = () => (
  <section className="mx-auto max-w-[1400px] px-5 py-12 md:px-8">
    <div className="grid gap-6 border-y border-[#F5BFC9] py-10 text-center sm:grid-cols-3">
      {ITEMS.map((item) => (
        <div key={item.title}>
          <span className="font-serif text-2xl text-[#C93663]">
            {item.icon}
          </span>
          <h3 className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-[#79163F]">
            {item.title}
          </h3>
          <p className="mt-2 text-sm text-[#9B6476]">{item.text}</p>
        </div>
      ))}
    </div>
  </section>
);

export default ValueStrip;
