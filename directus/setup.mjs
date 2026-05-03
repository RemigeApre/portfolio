// Idempotent Directus schema setup.
// Crée les 3 collections (articles, faq, realisations), leurs champs,
// et la permission de lecture publique sur les items "published".
//
// Usage local : docker compose exec web node /app/directus/setup.mjs
// Usage prod  : meme commande sur le VPS, apres docker compose up.
//
// Variables lues depuis l'environnement :
//   DIRECTUS_INTERNAL_URL (ex: http://directus:8055)
//   DIRECTUS_ADMIN_EMAIL
//   DIRECTUS_ADMIN_PASSWORD

const URL = process.env.DIRECTUS_INTERNAL_URL ?? 'http://directus:8055';
const EMAIL = process.env.DIRECTUS_ADMIN_EMAIL;
const PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD;

if (!EMAIL || !PASSWORD) {
  console.error('Missing DIRECTUS_ADMIN_EMAIL or DIRECTUS_ADMIN_PASSWORD');
  process.exit(1);
}

let token = '';

async function api(method, path, body) {
  const res = await fetch(`${URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${method} ${path} -> ${res.status}: ${text}`);
  }
  return res.status === 204 ? null : res.json();
}

async function login() {
  const r = await api('POST', '/auth/login', { email: EMAIL, password: PASSWORD });
  token = r.data.access_token;
  console.log('✓ logged in as admin');
}

async function collectionExists(name) {
  try {
    await api('GET', `/collections/${name}`);
    return true;
  } catch {
    return false;
  }
}

async function fieldExists(coll, field) {
  try {
    await api('GET', `/fields/${coll}/${field}`);
    return true;
  } catch {
    return false;
  }
}

async function createCollection(def) {
  if (await collectionExists(def.collection)) {
    console.log(`  – collection ${def.collection} already exists`);
    return;
  }
  await api('POST', '/collections', def);
  console.log(`  ✓ created collection ${def.collection}`);
}

async function createField(coll, def) {
  if (await fieldExists(coll, def.field)) {
    console.log(`    – field ${coll}.${def.field} already exists`);
    return;
  }
  await api('POST', `/fields/${coll}`, def);
  console.log(`    ✓ created field ${coll}.${def.field}`);
}

// Si le champ existe avec un mauvais type, le supprimer et le recréer (perte des données du champ).
async function ensureFieldType(coll, def) {
  try {
    const r = await api('GET', `/fields/${coll}/${def.field}`);
    if (r.data.type === def.type) {
      console.log(`    – field ${coll}.${def.field} already exists (type ${def.type})`);
      return;
    }
    console.log(`    ⚠ migrating ${coll}.${def.field}: ${r.data.type} → ${def.type} (drop + recreate)`);
    await api('DELETE', `/fields/${coll}/${def.field}`);
    await api('POST', `/fields/${coll}`, def);
    console.log(`    ✓ migrated ${coll}.${def.field}`);
  } catch {
    await api('POST', `/fields/${coll}`, def);
    console.log(`    ✓ created field ${coll}.${def.field}`);
  }
}

let publicPolicyId = null;

async function getPublicPolicyId() {
  if (publicPolicyId) return publicPolicyId;
  const r = await api('GET', '/policies?filter[name][_eq]=$t:public_label');
  if (!r.data || r.data.length === 0) {
    throw new Error('Public policy introuvable dans Directus');
  }
  publicPolicyId = r.data[0].id;
  return publicPolicyId;
}

async function ensurePublicRead(collection, withStatusFilter = true) {
  const policy = await getPublicPolicyId();
  const existing = await api(
    'GET',
    `/permissions?filter[policy][_eq]=${policy}&filter[collection][_eq]=${collection}&filter[action][_eq]=read`
  );
  if (existing.data && existing.data.length > 0) {
    console.log(`    – public read perm on ${collection} already exists`);
    return;
  }
  await api('POST', '/permissions', {
    policy,
    collection,
    action: 'read',
    fields: ['*'],
    ...(withStatusFilter
      ? { permissions: { _and: [{ status: { _eq: 'published' } }] } }
      : {}),
  });
  console.log(
    `    ✓ public read perm on ${collection}` + (withStatusFilter ? ' (status=published)' : '')
  );
}

const statusField = {
  field: 'status',
  type: 'string',
  meta: {
    interface: 'select-dropdown',
    options: {
      choices: [
        { text: 'Brouillon', value: 'draft' },
        { text: 'Publié', value: 'published' },
        { text: 'Archivé', value: 'archived' },
      ],
    },
    display: 'labels',
    display_options: {
      showAsDot: true,
      choices: [
        { text: 'Brouillon', value: 'draft', foreground: '#FFFFFF', background: '#A2B5CD' },
        { text: 'Publié', value: 'published', foreground: '#FFFFFF', background: '#2ECDA7' },
        { text: 'Archivé', value: 'archived', foreground: '#FFFFFF', background: '#A2B5CD' },
      ],
    },
    width: 'half',
    required: true,
  },
  schema: { default_value: 'draft', is_nullable: false },
};

const sortField = {
  field: 'sort',
  type: 'integer',
  meta: { interface: 'input', hidden: true, sort: 99 },
  schema: {},
};

async function setupArticles() {
  console.log('articles');
  await createCollection({
    collection: 'articles',
    meta: {
      icon: 'article',
      note: 'Articles de blog',
      sort_field: 'date_published',
      archive_field: 'status',
      archive_value: 'archived',
      unarchive_value: 'draft',
    },
    schema: {},
  });
  await createField('articles', statusField);
  await createField('articles', {
    field: 'title',
    type: 'string',
    meta: { interface: 'input', required: true, width: 'half', note: 'Titre FR (langue par défaut)' },
    schema: { is_nullable: false },
  });
  await createField('articles', {
    field: 'title_en',
    type: 'string',
    meta: { interface: 'input', width: 'half', note: 'Titre EN. Si vide, le FR sera affiché sur /en/blog.' },
    schema: {},
  });
  await createField('articles', {
    field: 'slug',
    type: 'string',
    meta: {
      interface: 'input',
      required: true,
      width: 'half',
      note: 'URL partagée : /blog/<slug> et /en/blog/<slug>',
      options: { slug: true, trim: true },
    },
    schema: { is_nullable: false, is_unique: true },
  });
  await createField('articles', {
    field: 'author',
    type: 'string',
    meta: { interface: 'input', width: 'half' },
    schema: {},
  });
  // date_published doit être un timestamp (avec heure), pas une date.
  // Permet de programmer un article à une date+heure précise (ex: 18h00 Paris).
  await ensureFieldType('articles', {
    field: 'date_published',
    type: 'timestamp',
    meta: { interface: 'datetime', width: 'half', display: 'datetime' },
    schema: {},
  });
  await createField('articles', {
    field: 'tags',
    type: 'csv',
    meta: { interface: 'tags', width: 'half', special: ['cast-csv'] },
    schema: {},
  });
  await createField('articles', {
    field: 'cover',
    type: 'uuid',
    meta: { interface: 'file-image', special: ['file'], width: 'full' },
    schema: {},
  });
  await createField('articles', {
    field: 'excerpt',
    type: 'text',
    meta: { interface: 'input-multiline', width: 'full', note: 'Résumé FR (160 chars max conseillé pour SEO)' },
    schema: {},
  });
  await createField('articles', {
    field: 'excerpt_en',
    type: 'text',
    meta: { interface: 'input-multiline', width: 'full', note: 'Résumé EN. Fallback FR si vide.' },
    schema: {},
  });
  await createField('articles', {
    field: 'content',
    type: 'text',
    meta: { interface: 'input-rich-text-html', width: 'full', note: 'Contenu FR', options: { toolbar: ['bold', 'italic', 'underline', 'h1', 'h2', 'h3', 'numlist', 'bullist', 'link', 'blockquote', 'code', 'image'] } },
    schema: {},
  });
  await createField('articles', {
    field: 'content_en',
    type: 'text',
    meta: { interface: 'input-rich-text-html', width: 'full', note: 'Contenu EN. Fallback FR si vide.', options: { toolbar: ['bold', 'italic', 'underline', 'h1', 'h2', 'h3', 'numlist', 'bullist', 'link', 'blockquote', 'code', 'image'] } },
    schema: {},
  });
  await ensurePublicRead('articles');
}

async function setupFaq() {
  console.log('faq');
  await createCollection({
    collection: 'faq',
    meta: {
      icon: 'help',
      note: 'Questions fréquentes',
      sort_field: 'sort',
      archive_field: 'status',
      archive_value: 'archived',
      unarchive_value: 'draft',
    },
    schema: {},
  });
  await createField('faq', statusField);
  await createField('faq', {
    field: 'question',
    type: 'string',
    meta: { interface: 'input', required: true, width: 'full', note: 'Question FR (langue par défaut)' },
    schema: { is_nullable: false },
  });
  await createField('faq', {
    field: 'question_en',
    type: 'string',
    meta: { interface: 'input', width: 'full', note: 'Question EN. Si vide, le FR sera affiché sur /en/faq.' },
    schema: {},
  });
  await createField('faq', {
    field: 'answer',
    type: 'text',
    meta: { interface: 'input-rich-text-html', required: true, width: 'full', note: 'Réponse FR' },
    schema: { is_nullable: false },
  });
  await createField('faq', {
    field: 'answer_en',
    type: 'text',
    meta: { interface: 'input-rich-text-html', width: 'full', note: 'Réponse EN. Fallback FR si vide.' },
    schema: {},
  });
  await createField('faq', {
    field: 'category',
    type: 'string',
    meta: { interface: 'input', width: 'half', note: 'Catégorie FR (groupe : Création, Maintenance, Général...)' },
    schema: {},
  });
  await createField('faq', {
    field: 'category_en',
    type: 'string',
    meta: { interface: 'input', width: 'half', note: 'Catégorie EN. Fallback FR si vide.' },
    schema: {},
  });
  await createField('faq', sortField);
  await ensurePublicRead('faq');
}

async function setupRealisations() {
  console.log('realisations');
  await createCollection({
    collection: 'realisations',
    meta: {
      icon: 'collections',
      note: 'Réalisations du portfolio',
      sort_field: 'sort',
      archive_field: 'status',
      archive_value: 'archived',
      unarchive_value: 'draft',
    },
    schema: {},
  });
  await createField('realisations', statusField);
  await createField('realisations', {
    field: 'title',
    type: 'string',
    meta: { interface: 'input', required: true, width: 'half', note: 'Titre FR' },
    schema: { is_nullable: false },
  });
  await createField('realisations', {
    field: 'title_en',
    type: 'string',
    meta: { interface: 'input', width: 'half', note: 'Titre EN. Fallback FR si vide.' },
    schema: {},
  });
  await createField('realisations', {
    field: 'slug',
    type: 'string',
    meta: { interface: 'input', required: true, width: 'half', options: { slug: true, trim: true } },
    schema: { is_nullable: false, is_unique: true },
  });
  await createField('realisations', {
    field: 'client',
    type: 'string',
    meta: { interface: 'input', width: 'half', note: 'Nom du client (commun aux deux langues)' },
    schema: {},
  });
  await createField('realisations', {
    field: 'url',
    type: 'string',
    meta: { interface: 'input', width: 'half', note: 'Lien vers le site, si public' },
    schema: {},
  });
  await createField('realisations', {
    field: 'tags',
    type: 'csv',
    meta: { interface: 'tags', width: 'full', special: ['cast-csv'] },
    schema: {},
  });
  await createField('realisations', {
    field: 'cover',
    type: 'uuid',
    meta: { interface: 'file-image', special: ['file'], width: 'full' },
    schema: {},
  });
  await createField('realisations', {
    field: 'description',
    type: 'text',
    meta: { interface: 'input-multiline', width: 'full', note: 'Description FR' },
    schema: {},
  });
  await createField('realisations', {
    field: 'description_en',
    type: 'text',
    meta: { interface: 'input-multiline', width: 'full', note: 'Description EN. Fallback FR si vide.' },
    schema: {},
  });
  await createField('realisations', sortField);
  await ensurePublicRead('realisations');
}

async function ensurePublicReadOnFiles() {
  console.log('directus_files');
  await ensurePublicRead('directus_files', false);
}

async function ensurePublicCreate(collection, fields) {
  const policy = await getPublicPolicyId();
  const existing = await api(
    'GET',
    `/permissions?filter[policy][_eq]=${policy}&filter[collection][_eq]=${collection}&filter[action][_eq]=create`
  );
  if (existing.data && existing.data.length > 0) {
    console.log(`    – public create perm on ${collection} already exists`);
    return;
  }
  await api('POST', '/permissions', {
    policy,
    collection,
    action: 'create',
    fields,
  });
  console.log(`    ✓ public create perm on ${collection} (fields: ${fields.join(', ')})`);
}

async function setupContactMessages() {
  console.log('contact_messages');
  await createCollection({
    collection: 'contact_messages',
    meta: {
      icon: 'mail',
      note: 'Messages reçus via le formulaire de contact du site',
      sort_field: 'date_created',
      archive_field: 'status',
      archive_value: 'archived',
      unarchive_value: 'new',
    },
    schema: {},
  });

  // Status: nouveau / lu / traité / archivé
  await createField('contact_messages', {
    field: 'status',
    type: 'string',
    meta: {
      interface: 'select-dropdown',
      options: {
        choices: [
          { text: 'Nouveau', value: 'new' },
          { text: 'Lu', value: 'read' },
          { text: 'Traité', value: 'processed' },
          { text: 'Archivé', value: 'archived' },
        ],
      },
      display: 'labels',
      display_options: {
        showAsDot: true,
        choices: [
          { text: 'Nouveau', value: 'new', foreground: '#FFFFFF', background: '#2ECDA7' },
          { text: 'Lu', value: 'read', foreground: '#FFFFFF', background: '#A2B5CD' },
          { text: 'Traité', value: 'processed', foreground: '#FFFFFF', background: '#6644FF' },
          { text: 'Archivé', value: 'archived', foreground: '#FFFFFF', background: '#A2B5CD' },
        ],
      },
      width: 'half',
      required: true,
    },
    schema: { default_value: 'new', is_nullable: false },
  });

  await createField('contact_messages', {
    field: 'date_created',
    type: 'timestamp',
    meta: {
      interface: 'datetime',
      readonly: true,
      hidden: false,
      width: 'half',
      display: 'datetime',
      display_options: { relative: true },
      special: ['date-created'],
    },
    schema: {},
  });

  await createField('contact_messages', {
    field: 'last_name',
    type: 'string',
    meta: { interface: 'input', required: true, width: 'half', note: 'Nom de famille (obligatoire)' },
    schema: { is_nullable: false },
  });

  await createField('contact_messages', {
    field: 'first_name',
    type: 'string',
    meta: { interface: 'input', width: 'half', note: 'Prénom (facultatif)' },
    schema: {},
  });

  await createField('contact_messages', {
    field: 'contact_email',
    type: 'string',
    meta: { interface: 'input', width: 'half', note: 'Email (au moins un moyen de contact requis)' },
    schema: {},
  });

  await createField('contact_messages', {
    field: 'contact_phone',
    type: 'string',
    meta: { interface: 'input', width: 'half', note: 'Téléphone' },
    schema: {},
  });

  await createField('contact_messages', {
    field: 'contact_postal',
    type: 'text',
    meta: { interface: 'input-multiline', width: 'full', note: 'Adresse postale' },
    schema: {},
  });

  await createField('contact_messages', {
    field: 'subject',
    type: 'string',
    meta: {
      interface: 'select-dropdown',
      options: {
        choices: [
          { text: 'Demande sur un service', value: 'service' },
          { text: 'Sujet divers', value: 'divers' },
        ],
      },
      width: 'half',
      required: true,
    },
    schema: { is_nullable: false },
  });

  await createField('contact_messages', {
    field: 'service_interest',
    type: 'string',
    meta: {
      interface: 'select-dropdown',
      options: {
        choices: [
          { text: 'Création web · Vitrine', value: 'creation-vitrine' },
          { text: 'Création web · Gestion', value: 'creation-gestion' },
          { text: 'Création web · E-commerce', value: 'creation-e-commerce' },
          { text: 'Création web · Logiciel sur mesure', value: 'creation-logiciel' },
          { text: 'Maintenance · Essentiel', value: 'maintenance-essentiel' },
          { text: 'Maintenance · Pro', value: 'maintenance-pro' },
          { text: 'Maintenance · Premium', value: 'maintenance-premium' },
          { text: 'Maintenance · Légendaire', value: 'maintenance-legendaire' },
          { text: "J'hésite encore", value: 'hesite' },
        ],
      },
      width: 'half',
      note: 'Renseigné uniquement si le sujet est "service"',
    },
    schema: {},
  });

  await createField('contact_messages', {
    field: 'message',
    type: 'text',
    meta: {
      interface: 'input-multiline',
      width: 'full',
      note: 'Obligatoire pour un sujet divers, facultatif pour un service',
    },
    schema: {},
  });

  await ensurePublicCreate('contact_messages', [
    'last_name',
    'first_name',
    'contact_email',
    'contact_phone',
    'contact_postal',
    'subject',
    'service_interest',
    'message',
  ]);
}

async function setupTools() {
  console.log('tools');
  await createCollection({
    collection: 'tools',
    meta: {
      icon: 'apps',
      note: 'Logiciels gratuits proposés au téléchargement',
      sort_field: 'sort',
      archive_field: 'status',
      archive_value: 'archived',
      unarchive_value: 'draft',
    },
    schema: {},
  });
  await createField('tools', statusField);
  await createField('tools', {
    field: 'app_type',
    type: 'string',
    meta: {
      interface: 'select-dropdown',
      options: { choices: [
        { text: 'Application bureau (à télécharger)', value: 'desktop' },
        { text: 'Application web (lien externe)', value: 'web' },
        { text: 'Extension navigateur', value: 'extension' },
      ]},
      width: 'half',
      required: true,
      display: 'labels',
    },
    schema: { default_value: 'desktop', is_nullable: false },
  });
  await createField('tools', {
    field: 'name_fr',
    type: 'string',
    meta: { interface: 'input', required: true, width: 'half', note: 'Nom (utilisé partout, sync avec name_en pour la cohérence brand)' },
    schema: { is_nullable: false },
  });
  await createField('tools', {
    field: 'name_en',
    type: 'string',
    meta: { interface: 'input', width: 'half', hidden: true, note: 'Auto-synchronisé sur name_fr' },
    schema: {},
  });
  await createField('tools', {
    field: 'slug',
    type: 'string',
    meta: { interface: 'input', required: true, width: 'half', options: { slug: true, trim: true }, note: 'Identifiant URL' },
    schema: { is_nullable: false, is_unique: true },
  });
  await createField('tools', {
    field: 'version',
    type: 'string',
    meta: { interface: 'input', width: 'half', note: 'Ex: 1.2.0' },
    schema: {},
  });
  await createField('tools', {
    field: 'description_fr',
    type: 'text',
    meta: { interface: 'input-multiline', width: 'full', note: 'Description en français' },
    schema: {},
  });
  await createField('tools', {
    field: 'description_en',
    type: 'text',
    meta: { interface: 'input-multiline', width: 'full', note: 'Description in English' },
    schema: {},
  });
  await createField('tools', {
    field: 'cover',
    type: 'uuid',
    meta: { interface: 'file-image', special: ['file'], width: 'full', note: 'Visuel optionnel' },
    schema: {},
  });
  await createField('tools', {
    field: 'downloads',
    type: 'json',
    meta: {
      interface: 'list',
      special: ['cast-json'],
      width: 'full',
      note: 'Une entrée par fichier téléchargeable',
      options: {
        template: '{{os}} · {{format}}',
        fields: [
          { field: 'os', name: 'OS', type: 'string', meta: { interface: 'select-dropdown', required: true, width: 'half', options: { choices: [
            { text: 'Windows', value: 'windows' },
            { text: 'macOS', value: 'macos' },
            { text: 'Linux', value: 'linux' },
            { text: 'Toutes plateformes', value: 'any' },
          ]}}},
          { field: 'format', name: 'Format', type: 'string', meta: { interface: 'select-dropdown', required: true, width: 'half', options: { choices: [
            { text: 'EXE (installeur)', value: 'exe' },
            { text: 'MSI (installeur)', value: 'msi' },
            { text: 'ZIP', value: 'zip' },
            { text: 'DMG', value: 'dmg' },
            { text: 'AppImage', value: 'appimage' },
            { text: 'DEB', value: 'deb' },
            { text: 'TAR.GZ', value: 'targz' },
          ]}}},
          { field: 'file', name: 'Fichier', type: 'uuid', meta: { interface: 'file', special: ['file'], required: true, width: 'full' }},
          { field: 'size_bytes', name: 'Taille (octets)', type: 'integer', meta: { interface: 'input', width: 'half', note: 'Optionnel : pour afficher la taille' }},
        ],
      },
    },
    schema: {},
  });
  await createField('tools', {
    field: 'download_count',
    type: 'integer',
    meta: { interface: 'input', readonly: true, width: 'half', note: 'Compteur incrémenté à chaque téléchargement' },
    schema: { default_value: 0, is_nullable: false },
  });

  // ── Pour app_type=web ──
  await createField('tools', {
    field: 'web_url',
    type: 'string',
    meta: { interface: 'input', width: 'full', note: "URL de l'app web (utilisé si app_type=web)" },
    schema: {},
  });

  // ── Pour app_type=extension ──
  await createField('tools', {
    field: 'extension_links',
    type: 'json',
    meta: {
      interface: 'list',
      special: ['cast-json'],
      width: 'full',
      note: 'Un lien par navigateur (utilisé si app_type=extension)',
      options: {
        template: '{{browser}}',
        fields: [
          { field: 'browser', type: 'string', meta: { interface: 'select-dropdown', required: true, width: 'half', options: { choices: [
            { text: 'Chrome', value: 'chrome' },
            { text: 'Firefox', value: 'firefox' },
            { text: 'Microsoft Edge', value: 'edge' },
            { text: 'Safari', value: 'safari' },
            { text: 'Brave', value: 'brave' },
            { text: 'Opera', value: 'opera' },
          ]}}},
          { field: 'url', type: 'string', meta: { interface: 'input', required: true, width: 'full' }},
        ],
      },
    },
    schema: {},
  });

  // ── Méta partagés ──
  await createField('tools', {
    field: 'github_url',
    type: 'string',
    meta: { interface: 'input', width: 'full', note: 'Lien vers le code source (GitHub, GitLab...)' },
    schema: {},
  });
  await createField('tools', {
    field: 'changelog',
    type: 'text',
    meta: { interface: 'input-rich-text-html', width: 'full', note: 'Journal de mise à jour (langue agnostique)' },
    schema: {},
  });
  await createField('tools', {
    field: 'usage_wiki_fr',
    type: 'text',
    meta: { interface: 'input-rich-text-html', width: 'full', note: "Mini-wiki d'usage en français" },
    schema: {},
  });
  await createField('tools', {
    field: 'usage_wiki_en',
    type: 'text',
    meta: { interface: 'input-rich-text-html', width: 'full', note: "Wiki d'usage en anglais (fallback FR si vide)" },
    schema: {},
  });

  // ── Présentation produit (vraie page logiciel pro) ──
  await createField('tools', {
    field: 'tagline_fr',
    type: 'string',
    meta: { interface: 'input', width: 'full', note: 'Accroche FR : une phrase sous le titre (~120 caractères)' },
    schema: {},
  });
  await createField('tools', {
    field: 'tagline_en',
    type: 'string',
    meta: { interface: 'input', width: 'full', note: 'Tagline EN, fallback FR si vide' },
    schema: {},
  });
  await createField('tools', {
    field: 'license',
    type: 'string',
    meta: { interface: 'input', width: 'half', note: 'Ex : MIT, GPL-3.0, Source disponible, etc.' },
    schema: {},
  });
  await createField('tools', {
    field: 'features',
    type: 'json',
    meta: {
      interface: 'list',
      special: ['cast-json'],
      width: 'full',
      note: 'Caractéristiques principales (3 à 6 conseillé). Affichées en grille sur la page détail.',
      options: {
        template: '{{title_fr}}',
        fields: [
          { field: 'title_fr', type: 'string', meta: { interface: 'input', required: true, width: 'half', note: 'Titre FR' }},
          { field: 'title_en', type: 'string', meta: { interface: 'input', width: 'half', note: 'Titre EN, fallback FR' }},
          { field: 'description_fr', type: 'text', meta: { interface: 'input-multiline', width: 'full', note: 'Description FR' }},
          { field: 'description_en', type: 'text', meta: { interface: 'input-multiline', width: 'full', note: 'Description EN, fallback FR' }},
        ],
      },
    },
    schema: {},
  });
  await createField('tools', {
    field: 'screenshots',
    type: 'json',
    meta: {
      interface: 'list',
      special: ['cast-json'],
      width: 'full',
      note: "Captures d'écran. Affichées en galerie sur la page détail.",
      options: {
        template: '{{caption_fr}}',
        fields: [
          { field: 'file', type: 'uuid', meta: { interface: 'file-image', special: ['file'], required: true, width: 'full' }},
          { field: 'caption_fr', type: 'string', meta: { interface: 'input', width: 'half', note: 'Légende FR (facultatif)' }},
          { field: 'caption_en', type: 'string', meta: { interface: 'input', width: 'half', note: 'Légende EN (facultatif)' }},
        ],
      },
    },
    schema: {},
  });

  await createField('tools', sortField);
  await ensurePublicRead('tools');
}

async function main() {
  console.log(`Setup Directus @ ${URL}\n`);
  await login();
  await setupArticles();
  await setupFaq();
  await setupRealisations();
  await setupContactMessages();
  await setupTools();
  await ensurePublicReadOnFiles();
  console.log('\n✓ done');
}

main().catch((e) => {
  console.error('FAIL', e);
  process.exit(1);
});
