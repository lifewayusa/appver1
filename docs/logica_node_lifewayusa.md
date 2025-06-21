// Lógicas principais para backend Node.js (ex: funções do Supabase ou rotas API)

// Exemplo: função para verificar qualify após formulário
export async function avaliarQualificacao(dadosForm, userId) {
  const qualify = dadosForm.renda > 3000 && dadosForm.idioma === 'avançado';

  await supabase
    .from('prospects')
    .update({ qualify })
    .eq('user_id', userId);

  return qualify;
}

// Exemplo: integração Stripe para upgrade
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function criarCheckout(userId) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price: process.env.STRIPE_PRICE_ID_PRO,
      quantity: 1
    }],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?pro=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/planos`,
    metadata: { userId }
  });
  return session.url;
}

// Webhook Stripe para ativar plano Pro
export async function webhookStripe(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const userId = event.data.object.metadata.userId;
    await supabase.from('prospects').update({ pro: true }).eq('user_id', userId);
  }

  res.json({ received: true });
}

