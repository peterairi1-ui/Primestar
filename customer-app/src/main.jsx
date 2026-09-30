import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, Bike, Check, ChevronDown, ChevronLeft, ChevronRight, Clock3, Instagram, MapPin, Menu, Minus, Package, Plus, Search, ShoppingBag, ShoppingCart, Sparkles, Trash2, Utensils, X } from 'lucide-react';
import { api, assetUrl } from './api';
import './style.css';
import './railMotion';

const heroVideo = new URL('../../assets/hero-video/WhatsApp Video 2026-09-04 at 4.10.31 AM.mp4', import.meta.url).href;
const logo = new URL('../../assets/branding/logo/WhatsApp Image 2026-09-07 at 12.46.43 AM.jpeg', import.meta.url).href;
const whatsappNumber = '2349123031088';
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi PRIMESTAR! I need some help.')}`;

function formatMoney(value) { return `₦${Number(value || 0).toLocaleString('en-NG')}`; }
function categoryIcon(type) { return type === 'package_delivery' ? Package : type === 'get4me' ? ShoppingBag : Utensils; }

function Marquee() { return <div className="marquee" aria-label="PRIMESTAR service message"><div className="marquee-track"><span>✦ Good Food. Good Company. ✦ Fast. Fresh. Reliable. ✦ Your Favourite Meals, Delivered to Your Door. ✦ PRIMESTAR — Our Bike.</span><span aria-hidden="true">✦ Good Food. Good Company. ✦ Fast. Fresh. Reliable. ✦ Your Favourite Meals, Delivered to Your Door. ✦ PRIMESTAR — Our Bike.</span></div></div>; }

function Header({ cartCount, onCart, onMenu }) { return <header className="site-header"><a className="brand" href="#top" aria-label="PRIMESTAR home"><img src={logo} alt="PRIMESTAR" /><span>OUR BIKE</span></a><nav className="desktop-nav"><a href="#discover">Discover</a><a href="#why">Why PRIMESTAR</a><a href="#contact">Contact</a></nav><div className="header-actions"><button className="icon-button cart-trigger" onClick={onCart} aria-label={`Open cart, ${cartCount} items`}><ShoppingCart size={20} /><b>{cartCount}</b></button><button className="icon-button menu-trigger" onClick={onMenu} aria-label="Open menu"><Menu size={22} /></button></div></header>; }

function Hero({ onOrder }) { return <section className="hero" id="top"><video className="hero-video" autoPlay muted loop playsInline poster={logo}><source src={heroVideo} type="video/mp4" /></video><div className="hero-shade" /><div className="hero-copy"><p className="eyebrow"><span /> Port Harcourt, delivered</p><h1>Fast. Fresh.<br /><em>Reliable.</em></h1><p className="hero-description">Delicious food and everyday requests, brought to your door by a team you can count on.</p><div className="hero-actions"><button className="button button-gold" onClick={onOrder}>Order now <ArrowRight size={18} /></button><a className="button button-ghost" href="#discover">Explore restaurants</a></div></div><div className="hero-scroll"><span>Scroll to discover</span><ChevronDown size={16} /></div></section>; }

function VendorRail({ vendors, selectedId, onSelect }) { const railRef = React.useRef(null); const dragRef = React.useRef(null); const pausedRef = React.useRef(false); const move = (amount) => railRef.current?.scrollBy({ left: amount, behavior: 'smooth' }); useEffect(() => { const rail = railRef.current; if (!rail || vendors.length < 2) return undefined; const timer = window.setInterval(() => { if (pausedRef.current) return; rail.scrollLeft += 0.7; if (rail.scrollLeft >= rail.scrollWidth / 2) rail.scrollLeft = 0; }, 30); return () => window.clearInterval(timer); }, [vendors.length]); const pause = () => { pausedRef.current = true; }; const resume = () => { pausedRef.current = false; }; const startDrag = (event) => { if (!railRef.current) return; pause(); dragRef.current = { x: event.clientX, scrollLeft: railRef.current.scrollLeft }; }; const drag = (event) => { if (!dragRef.current || !railRef.current) return; railRef.current.scrollLeft = dragRef.current.scrollLeft - (event.clientX - dragRef.current.x); }; const endDrag = () => { dragRef.current = null; resume(); }; const repeatedVendors = [...vendors, ...vendors]; return <section className="vendor-section" id="discover"><div className="section-heading"><div><p className="eyebrow eyebrow-navy">Your table, anywhere</p><h2>What are you craving?</h2></div><div className="rail-controls"><button className="icon-button light" onClick={() => move(-280)} aria-label="Scroll vendors left"><ChevronLeft size={18} /></button><button className="icon-button light" onClick={() => move(280)} aria-label="Scroll vendors right"><ChevronRight size={18} /></button></div></div><div className="vendor-rail" ref={railRef} onPointerEnter={pause} onPointerLeave={resume} onPointerDown={startDrag} onPointerMove={drag} onPointerUp={endDrag} onPointerCancel={endDrag} onFocus={pause} onBlur={resume}>{repeatedVendors.map((vendor, index) => { const Icon = categoryIcon(vendor.type); return <button className={`vendor-card ${selectedId === vendor._id ? 'selected' : ''}`} key={`${vendor._id}-${index}`} onClick={() => onSelect(vendor)}><span className="vendor-art">{vendor.logoUrl ? <img src={assetUrl(vendor.logoUrl)} alt={`${vendor.name} logo`} draggable="false" /> : <Icon size={27} />}</span><span className="vendor-name">{vendor.name}</span><span className="vendor-type">{vendor.type === 'package_delivery' ? 'Delivery service' : vendor.type === 'get4me' ? 'Get it for me' : 'Restaurant'}</span></button>; })}</div></section>; }

function ProductCard({ product, onOpen }) { return <article className={`product-card ${product.available === false ? 'unavailable' : ''}`}><button className="product-image" onClick={() => onOpen(product)} aria-label={`View ${product.name}`}><div className="image-frame">{product.imageUrl ? <img src={assetUrl(product.imageUrl)} alt="" loading="lazy" /> : <span className="missing-image"><Utensils size={22} /><small>Image coming soon</small></span>}</div>{product.available !== false && <span className="add-float"><Plus size={19} /></span>}</button><div className="product-info"><div><h3>{product.name}</h3>{product.description && <p>{product.description}</p>}</div><strong>{formatMoney(product.price)}</strong></div>{product.available === false && <span className="sold-out">Currently unavailable</span>}</article>; }

function RestaurantContent({ products, vendor, onOpen }) { const [query, setQuery] = useState(''); const [category, setCategory] = useState('All'); const categories = useMemo(() => ['All', ...new Set(products.map((product) => product.category).filter(Boolean))], [products]); const categoryDragRef = React.useRef(null); const suppressCategoryClickRef = React.useRef(false); useEffect(() => { setCategory('All'); }, [vendor._id]); const startCategoryDrag = (event) => { if (event.pointerType !== 'mouse') return; const row = event.currentTarget; categoryDragRef.current = { startX: event.clientX, scrollLeft: row.scrollLeft, moved: false }; }; const moveCategoryDrag = (event) => { const drag = categoryDragRef.current; if (!drag) return; const row = event.currentTarget; const delta = event.clientX - drag.startX; if (Math.abs(delta) > 4) drag.moved = true; if (drag.moved) { event.preventDefault(); row.scrollLeft = drag.scrollLeft - delta; } }; const endCategoryDrag = () => { if (categoryDragRef.current?.moved) { suppressCategoryClickRef.current = true; window.requestAnimationFrame(() => { suppressCategoryClickRef.current = false; }); } categoryDragRef.current = null; }; const selectCategory = (value) => { setCategory(value); }; const filtered = useMemo(() => { const search = query.toLowerCase().trim(); const visible = products.filter((product) => !search || `${product.name} ${product.description || ''}`.toLowerCase().includes(search)); return [...visible].sort((a, b) => category !== 'All' ? Number(b.category === category) - Number(a.category === category) : 0); }, [products, query, category]); return <div className="catalog"><div className="catalog-top"><div><p className="eyebrow eyebrow-navy">The {vendor.name} menu</p><h2>Pick your favourites.</h2></div><label className="search-box"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search this menu" aria-label="Search this menu" />{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={15} /></button>}</label></div><div className="category-picker"><button className={`category-all ${category === 'All' ? 'active' : ''}`} onClick={() => selectCategory('All')} role="tab" aria-selected={category === 'All'}>All</button><div className="category-row" role="tablist" onPointerDown={startCategoryDrag} onPointerMove={moveCategoryDrag} onPointerUp={endCategoryDrag} onPointerCancel={endCategoryDrag} onPointerLeave={endCategoryDrag}>{categories.slice(1).map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => selectCategory(item)} role="tab" aria-selected={category === item}>{item}</button>)}</div></div>{filtered.length ? <div className="product-grid">{filtered.map((product) => <ProductCard key={product._id} product={product} onOpen={onOpen} />)}</div> : <div className="empty-state"><Search size={23} /><h3>No dishes found</h3><p>Try another search or choose a different category.</p></div>}</div>; }

function ServicePanel({ vendor, onPackage }) { const isPackage = vendor.type === 'package_delivery'; const getLink = `https://wa.me/2349123031088?text=${encodeURIComponent(`Hi PRIMESTAR! I need something from ${vendor.name}.`)}`; return <div className="service-panel"><div className="service-copy"><span className="service-icon">{isPackage ? <Package /> : <ShoppingBag />}</span><p className="eyebrow eyebrow-navy">{isPackage ? 'Send it with us' : 'GET4ME service'}</p><h2>{isPackage ? 'Move anything.<br /><em>Anywhere.</em>' : `Need something from ${vendor.name}?<br /><em>We’ll get it.</em>`}</h2><p>{isPackage ? 'From pickup to handoff, tell us where it needs to go and we’ll take care of the journey.' : `Tell us what you need from ${vendor.name}. We’ll buy it and bring it to you.`}</p>{isPackage ? <button className="button button-navy" onClick={() => onPackage(vendor)}>Request a delivery <ArrowRight size={17} /></button> : <a className="button button-navy" href={getLink} target="_blank" rel="noreferrer">GET NOW <ArrowRight size={17} /></a>}</div><div className="service-detail"><div><Clock3 size={20} /><strong>Reliable timing</strong><span>We keep you in the loop</span></div><div><MapPin size={20} /><strong>Local knowledge</strong><span>Port Harcourt, covered</span></div><div><Check size={20} /><strong>Human support</strong><span>Real help when needed</span></div></div></div>; }

function ProductModal({ product, onClose, onAdd }) { const [quantity, setQuantity] = useState(1); if (!product) return null; return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="product-modal" role="dialog" aria-modal="true"><button className="close-button" onClick={onClose} aria-label="Close product"><X /></button><div className="modal-image">{product.imageUrl ? <img src={assetUrl(product.imageUrl)} alt={product.name} /> : <span className="missing-image"><Utensils size={26} /><small>Image coming soon</small></span>}</div><div className="modal-details"><p className="eyebrow eyebrow-navy">{product.category}</p><h2>{product.name}</h2><p className="modal-description">{product.description || 'Made fresh and ready to travel.'}</p><strong className="modal-price">{formatMoney(product.price)}</strong><div className="quantity-row"><div className="stepper"><button onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity"><Minus size={16} /></button><b>{quantity}</b><button onClick={() => setQuantity((value) => value + 1)} aria-label="Increase quantity"><Plus size={16} /></button></div><button className="button button-navy grow" onClick={() => onAdd(product, quantity)}>Add {quantity} for {formatMoney(product.price * quantity)}</button></div></div></section></div>; }

function CartDrawer({ cart, onClose, onChange, onCheckout }) { const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0); return <div className="drawer-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><aside className="cart-drawer"><div className="drawer-heading"><div><p className="eyebrow eyebrow-navy">Your order</p><h2>Cart <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span></h2></div><button className="close-button" onClick={onClose} aria-label="Close cart"><X /></button></div>{cart.length ? <><div className="cart-items">{cart.map(({ product, quantity }) => <div className="cart-item" key={product._id}><div className="cart-thumb">{product.imageUrl ? <img src={assetUrl(product.imageUrl)} alt="" /> : <Utensils size={16} />}</div><div className="cart-item-copy"><strong>{product.name}</strong><span>{formatMoney(product.price * quantity)}</span><div className="mini-stepper"><button onClick={() => onChange(product._id, -1)} aria-label="Decrease quantity"><Minus size={13} /></button><b>{quantity}</b><button onClick={() => onChange(product._id, 1)} aria-label="Increase quantity"><Plus size={13} /></button></div></div><button className="remove-button" onClick={() => onChange(product._id, -quantity)} aria-label={`Remove ${product.name}`}><Trash2 size={15} /></button></div>)}</div><div className="drawer-total"><div><span>Item total</span><strong>{formatMoney(subtotal)}</strong></div><div><span>Delivery fee</span><span className="muted">Calculated at checkout</span></div><div className="grand-total"><span>Total</span><strong>{formatMoney(subtotal)}</strong></div><button className="button button-gold full" onClick={onCheckout}>Checkout <ArrowRight size={17} /></button></div></> : <div className="cart-empty"><ShoppingBag size={30} /><h3>Your cart is waiting.</h3><p>Add something delicious and it’ll appear here.</p><button className="button button-navy" onClick={onClose}>Discover food</button></div>}</aside></div>; }

function CheckoutModal({ cart, onClose, onSuccess: onComplete }) { const [form, setForm] = useState({ name: '', phone: '', address: '', area: '', landmark: '' }); const [status, setStatus] = useState('idle'); const [error, setError] = useState(''); const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0); const update = (key) => (event) => setForm((value) => ({ ...value, [key]: event.target.value })); const submit = async (event) => { event.preventDefault(); setStatus('loading'); setError(''); try { const order = await api.createOrder({ guestCustomer: form, items: cart.map(({ product, quantity }) => ({ product: product._id, quantity })), deliveryLocation: { address: form.address, area: form.area, landmark: form.landmark }, notes: '' }); setStatus('success'); onComplete(order); } catch (requestError) { setError(requestError.message); setStatus('error'); } }; return <div className="modal-backdrop"><section className="checkout-modal" role="dialog" aria-modal="true"><div className="checkout-heading"><div><p className="eyebrow eyebrow-navy">Guest checkout</p><h2>Let’s get it moving.</h2></div><button className="close-button" onClick={onClose} aria-label="Close checkout"><X /></button></div>{status === 'success' ? <div className="success-state"><span className="success-icon"><Check /></span><h3>Order received.</h3><p>Your order <strong>{onComplete.orderId}</strong> is ready for payment confirmation. We’ll be in touch shortly.</p><a className="button button-navy" href={whatsappLink} target="_blank" rel="noreferrer">Contact PRIMESTAR <ArrowRight size={17} /></a></div> : <form onSubmit={submit}><div className="form-grid"><label>Name<input required value={form.name} onChange={update('name')} placeholder="Your name" /></label><label>Phone<input required type="tel" value={form.phone} onChange={update('phone')} placeholder="080..." /></label><label className="wide">Delivery address<input required value={form.address} onChange={update('address')} placeholder="House number and street" /></label><label>Area<input required value={form.area} onChange={update('area')} placeholder="e.g. NDDC" /></label><label>Landmark<input value={form.landmark} onChange={update('landmark')} placeholder="Nearby landmark" /></label></div><div className="location-note"><MapPin size={18} /><span>GPS pricing can be added once location permission is available. For now, your delivery fee will be confirmed by PRIMESTAR.</span></div>{error && <p className="form-error">{error}</p>}<div className="checkout-footer"><div><span>Items total</span><strong>{formatMoney(subtotal)}</strong></div><button className="button button-gold" disabled={status === 'loading'}>{status === 'loading' ? 'Sending...' : 'Place order'} <ArrowRight size={17} /></button></div></form>}</section></div>; }

function PackageModal({ onClose }) { const [sent, setSent] = useState(false); const [error, setError] = useState(''); const [form, setForm] = useState({ name: '', phone: '', pickup: '', delivery: '', pickupArea: '', deliveryArea: '', landmark: '', packageType: '', packageSize: '', description: '', specialInstructions: '' }); const update = (key) => (event) => setForm((value) => ({ ...value, [key]: event.target.value })); const submit = async (event) => { event.preventDefault(); setError(''); try { await api.packageRequest({ guest: { name: form.name, phone: form.phone }, pickup: { address: form.pickup, area: form.pickupArea, landmark: form.landmark, contactName: form.name, contactPhone: form.phone }, delivery: { address: form.delivery, area: form.deliveryArea, landmark: form.landmark, recipientName: form.name, recipientPhone: form.phone }, packageDescription: form.description, packageType: form.packageType, packageSize: form.packageSize, specialInstructions: form.specialInstructions }); setSent(true); } catch (requestError) { setError(requestError.message); } }; return <div className="modal-backdrop"><section className="checkout-modal package-modal"><div className="checkout-heading"><div><p className="eyebrow eyebrow-navy">Package delivery</p><h2>Tell us where it’s going.</h2></div><button className="close-button" onClick={onClose} aria-label="Close package form"><X /></button></div>{sent ? <div className="success-state"><span className="success-icon"><Check /></span><h3>We’ve got the request.</h3><p>A PRIMESTAR team member will follow up with the delivery details.</p><button className="button button-navy" onClick={onClose}>Done</button></div> : <form onSubmit={submit}><div className="form-grid"><label>Name<input required value={form.name} onChange={update('name')} placeholder="Your name" /></label><label>Phone<input required value={form.phone} onChange={update('phone')} placeholder="080..." /></label><label>Pickup address<input required value={form.pickup} onChange={update('pickup')} /></label><label>Pickup area<input required value={form.pickupArea} onChange={update('pickupArea')} /></label><label>Delivery address<input required value={form.delivery} onChange={update('delivery')} /></label><label>Delivery area<input required value={form.deliveryArea} onChange={update('deliveryArea')} /></label><label>Landmark<input value={form.landmark} onChange={update('landmark')} /></label><label>Package type<input required value={form.packageType} onChange={update('packageType')} placeholder="Document, food, parcel" /></label><label>Package size<input required value={form.packageSize} onChange={update('packageSize')} placeholder="Small, medium, large" /></label><label className="wide">Description<textarea required value={form.description} onChange={update('description')} /></label><label className="wide">Special instructions<textarea value={form.specialInstructions} onChange={update('specialInstructions')} /></label></div>{error && <p className="form-error">{error}</p>}<button className="button button-gold full">Request delivery <ArrowRight size={17} /></button></form>}</section></div>; }
function Get4MeModal({ vendor, onClose }) { const [sent, setSent] = useState(false); const [form, setForm] = useState({ name: '', phone: '', request: '', notes: '' }); const update = (key) => (event) => setForm((value) => ({ ...value, [key]: event.target.value })); const submit = async (event) => { event.preventDefault(); await api.get4meRequest({ vendor: vendor._id, guest: { name: form.name, phone: form.phone }, request: form.request, notes: form.notes }); setSent(true); }; const whatsapp = `https://wa.me/2349123031088?text=${encodeURIComponent(`Hi PRIMESTAR! I need something from ${vendor.name}: ${form.request}`)}`; return <div className="modal-backdrop"><section className="checkout-modal"><div className="checkout-heading"><div><p className="eyebrow eyebrow-navy">GET4ME / {vendor.name}</p><h2>We’ll get it for you.</h2></div><button className="close-button" onClick={onClose} aria-label="Close GET4ME form"><X /></button></div>{sent ? <div className="success-state"><span className="success-icon"><Check /></span><h3>Request received.</h3><p>We’ll confirm availability and follow up with the next step.</p><a className="button button-navy" href={whatsapp} target="_blank" rel="noreferrer">Continue on WhatsApp <ArrowRight size={17} /></a></div> : <form onSubmit={submit}><div className="form-grid"><label>Name<input required value={form.name} onChange={update('name')} /></label><label>Phone<input required value={form.phone} onChange={update('phone')} /></label><label className="wide">What should we get from {vendor.name}?<textarea required value={form.request} onChange={update('request')} /></label><label className="wide">Notes<textarea value={form.notes} onChange={update('notes')} /></label></div><button className="button button-gold full">Send GET4ME request <ArrowRight size={17} /></button></form>}</section></div>; }

function Benefits() { return <section className="benefits" id="why"><div className="benefit-intro"><p className="eyebrow">The PRIMESTAR promise</p><h2>More than a delivery.<br /><em>A better way there.</em></h2></div><div className="benefit-list"><div><span>01</span><Sparkles size={21} /><h3>Good food, handled right</h3><p>We bring the care of a great meal all the way to your door.</p></div><div><span>02</span><Bike size={21} /><h3>Your city, our route</h3><p>Local riders. Local knowledge. A service built around Port Harcourt.</p></div><div><span>03</span><Check size={21} /><h3>Reliability, every time</h3><p>Clear communication and thoughtful support from checkout to handoff.</p></div></div></section>; }

function Social() { return <section className="social" id="contact"><div><Instagram size={20} /><p className="eyebrow eyebrow-navy">Follow the ride</p><h2>Good things are<br /><em>on the way.</em></h2><p>See what’s fresh, what’s new, and where we’re headed next.</p><a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-link">@primestarourbike <ArrowRight size={15} /></a></div><div className="social-grid"><span>Freshly packed</span><span>On the move</span><span>Worth sharing</span><span>Made for here</span></div></section>; }

function Footer() { return <footer><div className="footer-brand"><img src={logo} alt="PRIMESTAR" /><p>Fast. Fresh. Reliable.</p></div><div className="footer-links"><a href="#discover">Discover</a><a href="#why">Why PRIMESTAR</a><a href={whatsappLink} target="_blank" rel="noreferrer">Support</a></div><span>© 2026 PRIMESTAR. Our Bike.</span></footer>; }

const vendorCacheKey = 'primestar-vendors-cache';
const vendorCacheMaxAge = 24 * 60 * 60 * 1000;
const pendingVendorSelectionMaxAge = 30 * 1000;

function readVendorCache() {
  try {
    const cached = JSON.parse(localStorage.getItem(vendorCacheKey) || 'null');
    const age = Date.now() - cached?.savedAt;
    const validItems = Array.isArray(cached?.items) && cached.items.length > 0 && cached.items.every((vendor) => vendor?._id && vendor.name && vendor.type);
    return validItems && age >= 0 && age <= vendorCacheMaxAge ? cached.items : null;
  } catch {
    return null;
  }
}

function App() {
  const [vendorCache] = useState(readVendorCache);
  const [vendors, setVendors] = useState(vendorCache || []);
  const [products, setProducts] = useState([]);
  const [selected, setSelectedState] = useState(null);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('primestar-cart') || '[]'));
  const [product, setProduct] = useState(null);
  const [drawer, setDrawer] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [packageOpen, setPackageOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(!vendorCache);
  const [apiError, setApiError] = useState('');
  const authoritativeVendorsRef = React.useRef([]);
  const vendorRequestStateRef = React.useRef('loading');
  const pendingVendorIdRef = React.useRef(null);
  const pendingVendorVersionRef = React.useRef(0);
  const pendingVendorTimerRef = React.useRef(null);
  const pendingVendorAttemptedRef = React.useRef(false);
  useEffect(() => {
    localStorage.setItem('primestar-cart', JSON.stringify(cart));
  }, [cart]);
  const clearPendingVendorSelection = () => {
    window.clearTimeout(pendingVendorTimerRef.current);
    pendingVendorTimerRef.current = null;
    pendingVendorIdRef.current = null;
    pendingVendorVersionRef.current += 1;
  };
  const setSelected = (vendor) => {
    if (vendorRequestStateRef.current === 'ready') {
      const freshVendor = authoritativeVendorsRef.current.find((item) => item._id === vendor?._id);
      if (freshVendor) setSelectedState(freshVendor);
      return;
    }
    if (vendorRequestStateRef.current !== 'loading' || !vendor?._id) return;
    pendingVendorAttemptedRef.current = true;
    pendingVendorIdRef.current = vendor._id;
    const version = ++pendingVendorVersionRef.current;
    window.clearTimeout(pendingVendorTimerRef.current);
    pendingVendorTimerRef.current = window.setTimeout(() => {
      if (pendingVendorVersionRef.current === version) pendingVendorIdRef.current = null;
    }, pendingVendorSelectionMaxAge);
  };
  useEffect(() => {
    let mounted = true;
    api.vendors().then((items) => {
      if (!mounted) return;
      authoritativeVendorsRef.current = items;
      vendorRequestStateRef.current = 'ready';
      setVendors(items);
      const pendingVendorId = pendingVendorIdRef.current;
      clearPendingVendorSelection();
      const confirmedPendingVendor = pendingVendorId && items.find((vendor) => vendor._id === pendingVendorId);
      setSelectedState(confirmedPendingVendor || (pendingVendorAttemptedRef.current ? null : items[0] || null));
      try {
        localStorage.setItem(vendorCacheKey, JSON.stringify({ savedAt: Date.now(), items }));
      } catch {}
    }).catch((error) => {
      if (!mounted) return;
      vendorRequestStateRef.current = 'failed';
      clearPendingVendorSelection();
      setSelectedState(null);
      setApiError(error.message);
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => {
      mounted = false;
      clearPendingVendorSelection();
    };
  }, []);
  useEffect(() => {
    if (!selected || selected.type !== 'restaurant') {
      setProducts([]);
      return;
    }
    api.products(selected._id).then(setProducts).catch((error) => setApiError(error.message));
  }, [selected]);
  const addToCart = (item, quantity) => {
    setCart((current) => {
      const found = current.find((entry) => entry.product._id === item._id);
      return found ? current.map((entry) => entry.product._id === item._id ? { ...entry, quantity: entry.quantity + quantity } : entry) : [...current, { product: item, quantity }];
    });
    setProduct(null);
    setDrawer(true);
  };
  const changeCart = (id, amount) => setCart((current) => current.map((entry) => entry.product._id === id ? { ...entry, quantity: entry.quantity + amount } : entry).filter((entry) => entry.quantity > 0));
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const scrollToOrder = () => document.querySelector('#discover')?.scrollIntoView({ behavior: 'smooth' });
  return <><Marquee /><Header cartCount={cartCount} onCart={() => setDrawer(true)} onMenu={() => setMenuOpen(true)} />{menuOpen && <div className="menu-panel"><button className="close-button" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></button><p className="eyebrow eyebrow-navy">PRIMESTAR</p><nav><a href="#top" onClick={() => setMenuOpen(false)}>Home</a><a href="#discover" onClick={() => setMenuOpen(false)}>Discover</a><a href="#discover" onClick={() => setMenuOpen(false)}>GET4ME</a><a href="#discover" onClick={() => setMenuOpen(false)}>Orders</a><a href="#contact" onClick={() => setMenuOpen(false)}>Profile</a><a href="#contact" onClick={() => setMenuOpen(false)}>Login / Create account</a></nav><a className="install-link" href="#top">Install app <ArrowRight size={16} /></a></div>}<main><Hero onOrder={scrollToOrder} />{loading ? <div className="loading-strip"><span className="spinner" /> Finding your local favourites...</div> : apiError && !vendors.length ? <div className="api-notice"><span>Catalog unavailable right now.</span><small>Start the backend and MongoDB to load live vendors and products.</small></div> : <VendorRail vendors={vendors} selectedId={selected?._id} onSelect={setSelected} />}{selected && <section className="selected-content">{selected.type === 'restaurant' ? <RestaurantContent products={products} vendor={selected} onOpen={setProduct} /> : <ServicePanel vendor={selected} onPackage={() => setPackageOpen(true)} />}</section>}<Benefits /><Social /></main><Footer /><a className="whatsapp-float" href={whatsappLink} target="_blank" rel="noreferrer" aria-label="Chat with PRIMESTAR on WhatsApp"><span>Chat with us</span><span className="whatsapp-dot">↗</span></a>{product && <ProductModal product={product} onClose={() => setProduct(null)} onAdd={addToCart} />}{drawer && <CartDrawer cart={cart} onClose={() => setDrawer(false)} onChange={changeCart} onCheckout={() => { setDrawer(false); setCheckout(true); }} />}{checkout && <CheckoutModal cart={cart} onClose={() => setCheckout(false)} onSuccess={(order) => { setCart([]); return order; }} />}{packageOpen && <PackageModal onClose={() => setPackageOpen(false)} />}</>;
}

createRoot(document.getElementById('root')).render(<App />);

