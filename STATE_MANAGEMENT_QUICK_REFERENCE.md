# Quick Reference: State Management Best Practices

## 🚀 Quick Start

### Using Cart Selectors
```typescript
import { useCartStore, selectTotalItems, selectTotalPrice } from "@/stores/cartStore";

// ✅ Good: Selective subscription
const totalItems = useCartStore(selectTotalItems);
const totalPrice = useCartStore(selectTotalPrice);

// ❌ Bad: Method-based (causes unnecessary re-renders)
const totalItems = useCartStore((state) => state.getTotalItems());
```

### Using Wishlist Selectors
```typescript
import { useWishlistStore, selectWishlistCount } from "@/stores/wishlistStore";

// ✅ Good: Selective subscription
const wishlistCount = useWishlistStore(selectWishlistCount);

// ❌ Bad: Full state subscription
const { items } = useWishlistStore();
const wishlistCount = items.length;
```

## 📊 Available Selectors

### Cart Store
| Selector | Returns | Use Case |
|----------|---------|----------|
| `selectTotalItems` | `number` | Badge showing cart item count |
| `selectTotalPrice` | `number` | Cart total, checkout subtotal |

### Wishlist Store
| Selector | Returns | Use Case |
|----------|---------|----------|
| `selectWishlistCount` | `number` | Badge showing wishlist count |

## 🎯 When to Use What

### Use Selectors When:
- ✅ You need computed values (totals, counts)
- ✅ Component only needs part of the state
- ✅ You want to prevent unnecessary re-renders

### Subscribe to Full State When:
- ✅ You need multiple related properties
- ✅ Component uses most/all of the state
- ✅ You're updating the UI based on state changes

## 📚 TanStack Query Configuration

Current default settings (optimized for Asper Beauty Shop):
```typescript
{
  staleTime: 5 * 60 * 1000,      // 5 minutes
  gcTime: 10 * 60 * 1000,         // 10 minutes
  refetchOnWindowFocus: false,    // Don't refetch on tab switch
  retry: 1,                       // 1 retry on failure
}
```

Override when needed:
```typescript
const { data } = useQuery({
  queryKey: ["special-data"],
  queryFn: fetchSpecialData,
  staleTime: 1 * 60 * 1000,  // 1 minute for fresher data
});
```

## 🔧 Common Patterns

### Pattern 1: Cart Badge
```typescript
const Header = () => {
  const totalItems = useCartStore(selectTotalItems);
  
  return (
    <Badge>
      {totalItems}
    </Badge>
  );
};
```

### Pattern 2: Cart Total Display
```typescript
const CartDrawer = () => {
  const totalPrice = useCartStore(selectTotalPrice);
  
  return (
    <div>
      Total: {totalPrice.toFixed(2)} JOD
    </div>
  );
};
```

### Pattern 3: Cart Actions
```typescript
const ProductCard = () => {
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setOpen);
  
  const handleAddToCart = () => {
    addItem(cartItem);
    setCartOpen(true);
  };
};
```

## ⚡ Performance Tips

1. **Subscribe Minimally**: Only subscribe to what you need
2. **Use Selectors**: For computed values, always use external selectors
3. **Avoid Inline Functions**: Use named selectors for better performance
4. **Batch Updates**: Zustand handles this automatically
5. **Leverage Query Cache**: Set appropriate staleTime for your data

## 🐛 Common Mistakes

### ❌ Mistake 1: Creating Selectors Inline
```typescript
// Bad: Creates new function on every render
const total = useCartStore((state) => 
  state.items.reduce((sum, item) => sum + item.quantity, 0)
);
```

### ✅ Solution: Use Exported Selectors
```typescript
// Good: Reuses same selector function
const total = useCartStore(selectTotalItems);
```

### ❌ Mistake 2: Subscribing to Entire Store
```typescript
// Bad: Re-renders on ANY store change
const store = useCartStore();
const total = store.getTotalItems();
```

### ✅ Solution: Selective Subscription
```typescript
// Good: Only re-renders when total changes
const total = useCartStore(selectTotalItems);
```

### ❌ Mistake 3: Too Aggressive Query Refetching
```typescript
// Bad: Refetches on every window focus
const { data } = useQuery({
  queryKey: ["products"],
  queryFn: fetchProducts,
  refetchOnWindowFocus: true,  // Default in vanilla QueryClient
});
```

### ✅ Solution: Use Optimized Defaults
```typescript
// Good: Uses our optimized defaults (5min staleTime)
const { data } = useQuery({
  queryKey: ["products"],
  queryFn: fetchProducts,
  // Inherits optimized defaults from App.tsx
});
```

## 📖 Further Reading

- [PERFORMANCE_OPTIMIZATIONS.md](./PERFORMANCE_OPTIMIZATIONS.md) - Deep technical guide
- [STATE_MANAGEMENT_OPTIMIZATION_SUMMARY.md](./STATE_MANAGEMENT_OPTIMIZATION_SUMMARY.md) - Executive summary
- [OPTIMIZATION_VISUAL_GUIDE.md](./OPTIMIZATION_VISUAL_GUIDE.md) - Visual diagrams

## 🎓 Learning Resources

- [Zustand Performance Guide](https://docs.pmnd.rs/zustand/guides/performance)
- [TanStack Query Caching](https://tanstack.com/query/latest/docs/framework/react/guides/caching)
- [React Optimization](https://react.dev/reference/react/memo)

---

**Last Updated**: February 25, 2026  
**Optimization Version**: 1.0  
**Build Time**: 5.13s  
**Bundle Size**: 405.06 kB (gzipped)
