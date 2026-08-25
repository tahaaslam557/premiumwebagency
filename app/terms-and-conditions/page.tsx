import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Premium Web Agency terms and conditions — revisions, turnaround, refunds, delivery, ownership, support and communication policies.",
  alternates: { canonical: "/terms-and-conditions" },
};

export default function TermsPage() {
  return (
    <LegalPage
      index="08"
      eyebrow="Legal / Terms"
      title={"Terms and\nconditions."}
      intro="The terms every engagement runs on — what you get, what we guarantee, and what happens when something needs to change."
      current="/terms-and-conditions"
    >
      <div className="legal-prose">
        <h2>Revision policy</h2>
        <p>
          The allotted number of revisions is based on your selected package and you can
          demand as many revisions as stated in your package details. We focus on providing
          the best services to our customers and will continue revising until your needs are
          met. You are not liable to pay an additional price if the design concepts are not
          changed. You will have your revised design in 48 hours.
        </p>

        <h2>Turnaround time</h2>
        <p>
          Premium Web Agency has 48–72 hour turnaround time for most design services. This is
          not the complete time from start to finish for a project, only the turnaround time
          for a single iteration of a design stage. Depending on the kind of service, the time
          required for revisions could be a minimum of 48 hours to 72 hours — this time means
          3 working days. For example:
        </p>
        <ul>
          <li>
            Logo orders placed or revisions requested on a Monday will be delivered by
            Wednesday.
          </li>
          <li>
            Logo orders placed or revisions requested on a Friday will be delivered by end of
            day Tuesday.
          </li>
        </ul>

        <h2>Refund policy</h2>
        <p>
          Premium Web Agency offers a 100% Refund on all its design services, however it is
          not an unconditional 100% refund and certain conditions still apply.
        </p>
        <p>
          Premium Web Agency offers a 100% Money Back Guarantee on all its design services.
          Customers can claim 100% of their money paid for the service back under the
          following circumstance:
        </p>

        <h3>Premium Web Agency&rsquo;s refund policy will be void if</h3>
        <ul>
          <li>You have chosen a special or a custom package.</li>
          <li>The primary design concept (for any service) has been approved.</li>
          <li>The logo has been finalised.</li>
          <li>The website has been designed, developed and deployed live.</li>
          <li>You have demanded revisions.</li>
          <li>The cancellation has been made due to reasons non-related to the project.</li>
          <li>
            If the client does not make contact within fourteen (14) calendar days or seven
            (7) business days by providing the required information, and fails to respond to
            communication attempts via email, phone, or message, they will no longer be
            considered eligible for a refund or to initiate a dispute.
          </li>
          <li>Company&rsquo;s policies, or policy, have been violated.</li>
          <li>Other company or designer has been approached for the same project.</li>
          <li>The creative brief is lacking in required information.</li>
          <li>A complete design change has been demanded.</li>
          <li>
            The claim has crossed the given &ldquo;request for refund&rdquo; time span.
          </li>
          <li>The business is closing or changing name or business.</li>
          <li>
            Reasons such as &ldquo;change of mind,&rdquo; &ldquo;disagreement with
            partner,&rdquo; or other reasons that do not pertain to the service will not be
            subject to refund under any circumstances.
          </li>
          <li>
            If the project has been on-board for more than 25 days, and prospects have been
            made according to the client&rsquo;s requirements, the client will be entitled to
            a 50% refund; if the project exceeds 35 days, the client will be entitled to a 30%
            refund.
          </li>
          <li>
            Once a client has accepted multiple sets of revisions (for any service):
            <ul>
              <li>
                The client may be entitled to claim 50% of the refund after discussion with
                their Project Manager.
              </li>
              <li>
                The refund approval will be at the discretion of Premium Web Agency&rsquo;s
                management.
              </li>
              <li>Management&rsquo;s decision on the matter will be final.</li>
            </ul>
          </li>
          <li>
            If a client subscribes for a service bundle and happens to be dissatisfied with a
            particular service, refund will only be applicable on that particular service and
            not the entire bundle.
          </li>
          <li>
            Cancellations of orders prior to project initiation, due to reasons unrelated to
            the design service itself, will be subjected to a 33% cancellation administrative
            fee.
          </li>
        </ul>
        <p>
          <strong>Note:</strong> Premium Web Agency holds all rights to reject any project or
          cancel the contract whenever it deems necessary. After the refund, you will not have
          any rights to use the designs for any purpose; they will be the sole property of
          Premium Web Agency. The company will be the rightful owner of the designs.
        </p>
        <p>
          Services not related to design services are not eligible for refunds under any
          circumstances. They are not covered under our 100% money back guarantee. If such a
          service is acquired as part of a package deal of any kind, they cannot be used to
          request a refund on the entire package. Examples of such services are as follows:
        </p>
        <ul>
          <li>Copyrights Protection Certificates</li>
          <li>Website &amp; Emails Hosting Services</li>
          <li>Website SSL Certificates</li>
          <li>Website Domain Purchase</li>
          <li>Website Maintenance Plans</li>
          <li>Website SEO Plans</li>
          <li>Social Media Marketing</li>
          <li>Google Adwords Campaigns</li>
        </ul>
        <p>
          For services that are not covered under the 100% refund policy in case of
          dissatisfaction, Premium Web Agency management, after reviewing the project, may
          choose to offer a partial refund to the client.
        </p>

        <h2>Claim your refund</h2>
        <p>To claim your refund, please follow these steps:</p>
        <ul>
          <li>
            Dial our toll-free number, +1 (833) 945-5567, and speak with your respective
            Project Manager to initiate a refund.
          </li>
          <li>Start a live chat and speak with a representative to initiate a refund.</li>
          <li>Send us an email to initiate a refund.</li>
        </ul>
        <p>
          As soon as we receive your refund request, we will respond to it at our earliest;
          once the required analysis is completed we will initiate the process according to
          our refund policy stated above.
        </p>
        <p>
          To cancel a project prior to project initiation, due to reasons unrelated to the
          service itself, the refund request must be made within 24 hours of order placement
          in order to receive a full refund. Failing to do so will result in a service fee
          charge if a cancellation is requested after the initial 24 hours.
        </p>
        <p>
          After you have received your refund, you will not have any rights to any designs
          submitted by Premium Web Agency, unless mutually agreed by the company and the
          customer through written communication. The information will be submitted for
          Copyright Acquisition with the government copyright agencies to maintain legality.
        </p>

        <h2>Quality assurance policy</h2>
        <p>
          Premium Web Agency will do its best to meet your requirements and our designers do
          their best to fulfill your expectations. We believe in providing the best designs,
          and each of our designs is well researched and well crafted.
        </p>

        <h2>100% satisfaction guarantee</h2>
        <ul>
          <li>Our unlimited revisions policy is to make sure that you are 100% satisfied.</li>
          <li>We aim to exceed your expectations and strive to accomplish it.</li>
          <li>
            We do not stop our revisions until you are completely satisfied with your design
            (number of revisions will be according to your package).
          </li>
        </ul>

        <h2>Delivery policy</h2>
        <ul>
          <li>
            The complete order will be sent to the mentioned account on the date stated on the
            order confirmation, and a confirmation email will also be sent.
          </li>
          <li>
            The turnaround time will be according to the package; the minimum time required is
            2 business days.
          </li>
          <li>
            Websites will only be made live once all dues have been cleared. Under no
            condition will a website be made live if there are any dues outstanding.
          </li>
          <li>In case of an urgent or rush order, contact our customer support team.</li>
        </ul>

        <h2>Design ownership &amp; rights</h2>
        <p>
          All finalised designs provided by Premium Web Agency are done so on written request
          of finalisation by the client, and upon finalisation the client receives all final
          core files of the logo and owns 100% of all rights of ownership to the said logo.
        </p>
        <ul>
          <li>Client shall own the Final Design provided by Premium Web Agency in its entirety.</li>
          <li>All ownership rights of the said finalised design will belong to the client 100%.</li>
          <li>The client is free to use the finalised design as they see fit.</li>
          <li>
            Client shall not, however, own any materials, media, or other content generated
            during any revision cycles leading up to the Final Product.
          </li>
        </ul>

        <h2>Content creation &amp; population</h2>
        <p>
          Premium Web Agency will not be responsible for creating or populating content (e.g.
          text/images) into the website, unless purchased exclusively otherwise. In which case:
        </p>
        <ul>
          <li>
            Premium Web Agency will populate the website with content created for the client.
            <ul>
              <li>
                The content/text for the website will be created specifically for the
                customer&rsquo;s website.
              </li>
            </ul>
          </li>
          <li>
            Premium Web Agency will populate the website with images.
            <ul>
              <li>
                Premium Web Agency will acquire stock imagery for the client from stock photo
                websites.
              </li>
              <li>Images will be purchased upon approval from the client.</li>
              <li>
                Premium Web Agency will not be responsible in any way for any similarities
                between images used on the site and other websites.
              </li>
            </ul>
          </li>
          <li>
            Premium Web Agency will populate the website with products and product details.
            <ul>
              <li>Product images and product details will be provided by the client.</li>
            </ul>
          </li>
        </ul>

        <h2>N.D.A. &amp; reputation management policy</h2>
        <ul>
          <li>
            Premium Web Agency does not share customer information regarding their project or
            contact details with anyone. The client&rsquo;s personal and project information is
            kept confidential at all points.
          </li>
          <li>
            Once the project is completed successfully, both parties — Premium Web Agency and
            the client — agree not to intentionally defame or otherwise disparage the other
            with respect to matters arising after project completion.
          </li>
          <li>
            Once the project is completed successfully, each party agrees to refrain from (and
            Premium Web Agency shall take reasonable steps to cause its officers and directors
            to refrain from), either directly or indirectly, making any defamatory comments of
            any type about the other (and, in the case of the company, its employees, officers,
            directors, agents, consultants, affiliates, investors, or business partners).
          </li>
        </ul>

        <h2>Record maintenance</h2>
        <p>
          Premium Web Agency keeps records of finalized designs so that in case of any
          misplaced order, you will be provided the exact file.
        </p>

        <h2>Customer support</h2>
        <p>
          Our Customer Support Team is present in the office Monday–Friday, 9 AM to 5 PM GMT,
          to answer all of your concerns and queries over the phone. All other queries after
          business hours need to be emailed and will be picked up the next working day.
        </p>

        <h2>Technical support policy</h2>
        <p>
          Premium Web Agency is primarily a design service and design consultancy provider. We
          will design and develop the services that the client needs. On occasion our packages
          and services purchased will include technical aspects to help the client with their
          websites and emails. Premium Web Agency will provide the client with basic
          information regarding those services and the settings required to make them work.
          Premium Web Agency will not be responsible for providing detailed training or
          installation of said services on the customer&rsquo;s end. Such services may include,
          but are not limited to:
        </p>
        <ul>
          <li>
            <strong>Website deployment</strong>
            <ul>
              <li>
                Premium Web Agency will deploy the website for the customer on a hosting server
                provided by us. This hosting service is provided free of cost as an added
                feature, acquired from a third-party service provider.
              </li>
              <li>
                Or on a hosting server provided by the customer (purchased from a third party).
                We offer our hosting servers to clients for a two-week trial period, during
                which clients can evaluate security and performance. After the trial period,
                clients are required to purchase their own hosting servers to continue their
                development cycle.
              </li>
              <li>
                In the event the website is hosted on a third-party webserver purchased by the
                customer, Premium Web Agency will not be held responsible for any server or
                hosting-related issues.
              </li>
              <li>
                There is no Service Level Agreement (SLA) between client and Premium Web Agency
                in terms of technical assistance or service outage, unless purchased separately
                as an ongoing maintenance service.
              </li>
            </ul>
          </li>
          <li>
            <strong>Website content management system (CMS)</strong>
            <ul>
              <li>
                Premium Web Agency will provide the customer with a user manual to use the
                website CMS.
              </li>
              <li>
                Premium Web Agency will not be responsible for training the client in the use
                of the CMS.
              </li>
            </ul>
          </li>
          <li>
            <strong>Emails setup</strong>
            <ul>
              <li>
                Premium Web Agency will provide the customer with the necessary settings and
                information to install email on their end.
              </li>
              <li>
                Premium Web Agency will not be responsible for installing said emails on the
                customer&rsquo;s end.
              </li>
              <li>
                Premium Web Agency will not be responsible for technical support or
                troubleshooting email usage errors, as all emails are on open servers
                accessible by all service providers.
              </li>
            </ul>
          </li>
        </ul>
        <p>
          Premium Web Agency will not be held responsible in any way for a customer&rsquo;s
          failure to execute, install, or learn the usage of the above services on their end,
          as those responsibilities lie with the customer.
        </p>

        <h2>Communication policy</h2>
        <ul>
          <li>
            All feedback requests, revision requests, refund requests, or any other
            instructions pertaining to an order need to go through our official client platform
            in order to be considered official.
          </li>
          <li>
            Premium Web Agency will not be responsible for any communication done via any
            platform other than our official client platform, or any phone numbers not provided
            by us or listed on our official website.
          </li>
          <li>
            Emails sent back and forth through official
            &ldquo;…@premiumwebagency.com&rdquo; addresses are the only communications
            considered valid.
          </li>
          <li>
            We are not responsible for any damages, issues, or delays caused by contact made
            through means of communication not provided by us.
          </li>
          <li>We take full responsibility for all information provided through our official domains.</li>
        </ul>
      </div>
    </LegalPage>
  );
}
